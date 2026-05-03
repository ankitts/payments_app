import asyncio
import json

from config import PaymentStatus
from payment_processor.schemas import ProcessPaymentEvent
from db.database import AsyncSessionLocal
from payment_processor.repository import PaymentProcessorRepository, MerchantRepository
from payment_processor.webhook_security import webhook_request_headers
from interface.http_handler import HTTPHandler
from ledger.service import LedgerService


class PaymentProcessor:

    @staticmethod
    async def process_payment(process_payment_event: ProcessPaymentEvent) -> dict:
        """
        Process a payment intent (async aio-pika consumer + async DB session).
        """
        payment_intent_id = process_payment_event.payment_intent_id
        print(f"Processing payment intent: {payment_intent_id}")
        await asyncio.sleep(3)

        async with AsyncSessionLocal() as db:
            payment_intent = await PaymentProcessorRepository.get_by_id(
                payment_intent_id, db
            )
            if not payment_intent:
                return {
                    "status": "error",
                    "message": "Payment intent not found",
                }

            if payment_intent.status != PaymentStatus.PROCESSING.value:
                return {
                    "status": "error",
                    "message": "Payment intent is not in processing status",
                }

            payment_intent.status = PaymentStatus.SUCCESS.value
            await PaymentProcessorRepository.update(payment_intent, db)

            await LedgerService.create_credit_entry(payment_intent, db)
            print(f"Payment intent processed successfully: {payment_intent_id}")

        await PaymentProcessor.send_webhook(payment_intent_id)
        return {
            "status": "success",
            "message": "Payment intent processed successfully",
        }

    @staticmethod
    async def send_webhook(payment_intent_id: str) -> None:
        """
        POST webhook JSON to merchant URL with X-Webhook-Signature (v1=HMAC-SHA256).
        """
        async with AsyncSessionLocal() as db:
            payment_intent = await PaymentProcessorRepository.get_by_id(payment_intent_id, db)
            if not payment_intent:
                print(f"Payment intent not found for webhook: {payment_intent_id}")
                return

            merchant_id = payment_intent.merchant_id
            merchant = await MerchantRepository.get_by_id(merchant_id, db)
            if not merchant:
                print(f"Merchant not found: {merchant_id}")
                return

            webhook_url = merchant.webhook_url
            webhook_secret = merchant.webhook_secret
            if not webhook_url or not webhook_secret:
                print(f"Webhook URL or secret not found: {merchant_id}. Not sending webhook.")
                return

            payload = {
                "payment_intent_id": payment_intent.id,
                "amount": payment_intent.amount,
                "currency": payment_intent.currency,
                "status": payment_intent.status,
                "order_id": payment_intent.order_id,
                "created_at": payment_intent.created_at.isoformat(),
                "updated_at": payment_intent.updated_at.isoformat(),
            }
            body_str = json.dumps(
                payload, separators=(",", ":"), sort_keys=True, ensure_ascii=False
            )
            headers = {
                "Content-Type": "application/json; charset=utf-8",
                **webhook_request_headers(webhook_secret, body_str),
            }

            client = HTTPHandler.get_instance()
            response = await client.post(
                webhook_url,
                content=body_str.encode("utf-8"),
                headers=headers,
            )
            if response.is_success:
                print(f"Webhook delivered for payment intent {payment_intent_id}")
            else:
                print(
                    f"Webhook failed {response.status_code} for intent {payment_intent_id}: "
                    f"{response.text[:500]}"
                )
