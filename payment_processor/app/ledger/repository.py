from db.models.ledger import LedgerEntry
from sqlalchemy.ext.asyncio import AsyncSession

class LedgerEntryRepository:
    """
    Repository class for ledger entries.
    """
    @staticmethod
    async def create_ledger_entry(ledger_entry: LedgerEntry, db: AsyncSession) -> None:
        """
        Repository to create a ledger entry.
        """
        db.add(ledger_entry)
        await db.commit()
        await db.refresh(ledger_entry)
        return ledger_entry