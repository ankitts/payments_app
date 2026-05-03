import asyncio

from config import PaymentStatus
from payment_processor.schema import ProcessPaymentEvent
from db.database import AsyncSessionLocal
from payment_processor.repository import PaymentProcessorRepository


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
            db_intent = await PaymentProcessorRepository.get_by_id(
                payment_intent_id, db
            )
            if not db_intent:
                return {
                    "status": "error",
                    "message": "Payment intent not found",
                }

            if db_intent.status != PaymentStatus.PROCESSING.value:
                return {
                    "status": "error",
                    "message": "Payment intent is not in processing status",
                }

            db_intent.status = PaymentStatus.SUCCESS.value
            await PaymentProcessorRepository.update(db_intent, db)
            print(f"Payment intent processed successfully: {payment_intent_id}")

        return {
            "status": "success",
            "message": "Payment intent processed successfully",
        }
