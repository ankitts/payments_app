from sqlalchemy.ext.asyncio import AsyncSession

from payments_db.models import Merchant
from ledger.schemas import LedgerEntrySchema
from ledger.repository import LedgerEntryRepository


class LedgerService:
    """
    Service class for ledger entries.
    """
    @staticmethod
    async def list_for_merchant(
        merchant: Merchant,
        db: AsyncSession,
    ) -> list[LedgerEntrySchema]:
        """
        Service to list all ledger entries for a merchant.
        Args:
            merchant (Merchant): The current merchant.
            db (AsyncSession): The database session.
        Returns:
            list[LedgerEntrySchema]: The list of ledger entries.
        """
        # List payment intents by merchant
        rows = await LedgerEntryRepository.list_by_merchant(
            merchant_id=merchant.id,
            db=db,
        )
        print("Ledger entries listed for merchant:", merchant.id)

        return [
            LedgerEntrySchema(
                id=r.id,
                merchant_id=r.merchant_id,
                operation_id=r.operation_id,
                entry_type=r.entry_type.value
                if hasattr(r.entry_type, "value")
                else str(r.entry_type),
                amount=r.amount,
                currency=r.currency,
                description=r.description,
                created_at=r.created_at,
            )
            for r in rows
        ]