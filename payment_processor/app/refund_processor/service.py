import asyncio

from config import RefundStatus
from refund_processor.schemas import RefundPaymentEvent
from db.session import AsyncSessionLocal
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

            refund.status = RefundStatus.SUCCESS.value
            await RefundRepository.update(refund, db)
            await LedgerService.create_debit_entry(refund, db)
            await WalletService.subtract_from_available_balance(refund.merchant_id, refund.amount, db)
            print(f"Refund processed successfully: {refund_id}")

        return {
            "status": "success",
            "message": "Refund processed successfully",
        }
