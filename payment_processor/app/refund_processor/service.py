import asyncio

from config import RefundStatus
from refund_processor.schemas import RefundPaymentEvent
from db.session import AsyncSessionLocal
from payment_processor.repository import PaymentIntentRepository
from refund_processor.repository import RefundRepository
from ledger.service import LedgerService
from wallet.service import WalletService
from wallet.repository import WalletRepository

class RefundProcessor:

    @staticmethod
    async def refund_payment(refund_payment_event: RefundPaymentEvent) -> dict:
        """
        Refund a payment intent (async aio-pika consumer + async DB session).
        """
        refund_id = refund_payment_event.refund_id
        print(f"Refunding payment intent: {refund_id}")
        await asyncio.sleep(3)

        async with AsyncSessionLocal() as db:
            refund = await RefundRepository.get_by_id(
                refund_id, db
            )
            if not refund:
                return {
                    "status": "error",
                    "message": "Refund not found",
                }

            if refund.status != RefundStatus.PENDING.value:
                return {
                    "status": "error",
                    "message": "Refund is not in pending status",
                }

            wallet = await WalletRepository.get_by_merchant_id(refund.merchant_id, db)
            if wallet.available_balance < refund.amount:
                return {
                    "status": "error",
                    "message": "Available balance is less than refund amount",
                }

            payment_intent = await PaymentIntentRepository.get_by_id(
                refund.payment_intent_id, db
            )
            if not payment_intent:
                return {
                    "status": "error",
                    "message": "Payment intent not found for refund",
                }
            if payment_intent.refundable_amount < refund.amount:
                return {
                    "status": "error",
                    "message": "Refundable amount no longer covers this refund",
                }

            refund.status = RefundStatus.SUCCESS.value
            await RefundRepository.update(refund, db)

            payment_intent = await PaymentIntentRepository.get_by_id(
                refund.payment_intent_id, db
            )
            if payment_intent:
                payment_intent.refundable_amount -= refund.amount
                await PaymentIntentRepository.update(payment_intent, db)

            await LedgerService.create_debit_entry(refund, db)
            await WalletService.subtract_from_available_balance(refund.merchant_id, refund.amount, db)
            print(f"Refund processed successfully: {refund_id}")

        return {
            "status": "success",
            "message": "Refund processed successfully",
        }
