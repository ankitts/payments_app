from sqlalchemy.ext.asyncio import AsyncSession
from db.models.payment import PaymentIntent
from db.models.ledger import LedgerEntry
from db.models.ledger import LedgerEntryType
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
            payment_intent_id=payment_intent.id,
            merchant_id=payment_intent.merchant_id,
            entry_type=LedgerEntryType.CREDIT,
            amount=payment_intent.amount,
            currency=payment_intent.currency,
            description=f"Payment received",
        )
        await LedgerEntryRepository.create_ledger_entry(ledger_entry, db)