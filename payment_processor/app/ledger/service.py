from sqlalchemy.ext.asyncio import AsyncSession
from payments_db.models import LedgerEntry, LedgerEntryType, PaymentIntent, Refund
from ledger.repository import LedgerEntryRepository

class LedgerService:
    """
    Service class for ledger entries.
    """
    @staticmethod
    async def create_credit_entry(payment_intent: PaymentIntent, db: AsyncSession) -> None:
        """
        Service to create a credit ledger entry.
        """
        ledger_entry = LedgerEntry(
            operation_id=payment_intent.id,
            merchant_id=payment_intent.merchant_id,
            entry_type=LedgerEntryType.CREDIT,
            amount=payment_intent.amount,
            currency=payment_intent.currency,
            description=f"Payment received",
        )
        await LedgerEntryRepository.create_ledger_entry(ledger_entry, db)

    @staticmethod
    async def create_debit_entry(refund: Refund, db: AsyncSession) -> None:
        """
        Service to create a debit ledger entry.
        """
        ledger_entry = LedgerEntry(
            operation_id=refund.id,
            merchant_id=refund.merchant_id,
            entry_type=LedgerEntryType.DEBIT,
            amount=refund.amount,
            currency=refund.currency,
            description=f"Refund issued"
        )
        await LedgerEntryRepository.create_ledger_entry(ledger_entry, db)