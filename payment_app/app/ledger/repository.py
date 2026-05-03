from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from db.models.ledger import LedgerEntry


class LedgerEntryRepository:
    """
    Repository class for ledger entries.
    """

    @staticmethod
    async def create(
        ledger_entry: LedgerEntry,
        db: AsyncSession,
    ) -> LedgerEntry:
        """
        Repository to create a ledger entry.
        Args:
            ledger_entry (LedgerEntry): The ledger entry to create.
            db (AsyncSession): The database session.
        Returns:
            LedgerEntry: The created ledger entry.
        """
        db.add(ledger_entry)
        await db.commit()
        await db.refresh(ledger_entry)
        return ledger_entry

    @staticmethod
    async def get_by_id(
        ledger_entry_id: str,
        db: AsyncSession,
    ) -> LedgerEntry | None:
        """
        Repository to get a ledger entry by ID.
        Args:
            ledger_entry_id (str): The ID of the ledger entry.
            db (AsyncSession): The database session.
        Returns:
            LedgerEntry | None: The ledger entry if found, otherwise None.
        """
        result = await db.execute(
            select(LedgerEntry).where(LedgerEntry.id == ledger_entry_id)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def list_by_merchant(
        merchant_id: str,
        db: AsyncSession,
    ) -> list[LedgerEntry]:
        """
        Repository to list all ledger entries for a merchant.
        Args:
            merchant_id (str): The ID of the merchant.
            db (AsyncSession): The database session.
        Returns:
            list[LedgerEntry]: The list of ledger entries.
        """
        result = await db.execute(
            select(LedgerEntry).where(LedgerEntry.merchant_id == merchant_id)
        )
        return list[LedgerEntry](result.scalars().all())