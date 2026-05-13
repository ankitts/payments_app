from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from payments_db.models import Merchant


class MerchantRepository:
    """
    Repository class for merchants.
    """

    @staticmethod
    async def get_by_email(email: str, db: AsyncSession) -> Merchant | None:
        """
        Repository to get a merchant by email.
        Args:
            email (str): The email of the merchant.
            db (AsyncSession): The database session.
        Returns:
            Merchant | None: The merchant if found, otherwise None.
        """
        result = await db.execute(select(Merchant).where(Merchant.email == email))
        return result.scalar_one_or_none()

    @staticmethod
    async def get_by_id(merchant_id: str, db: AsyncSession) -> Merchant | None:
        """
        Repository to get a merchant by ID.
        Args:
            merchant_id (str): The ID of the merchant.
            db (AsyncSession): The database session.
        Returns:
            Merchant | None: The merchant if found, otherwise None.
        """
        result = await db.execute(select(Merchant).where(Merchant.id == merchant_id))
        return result.scalar_one_or_none()

    @staticmethod
    async def create(merchant: Merchant, db: AsyncSession) -> Merchant:
        """
        Repository to create a merchant.
        Args:
            merchant (Merchant): The merchant to create.
            db (AsyncSession): The database session.
        Returns:
            Merchant: The created merchant.
        """
        db.add(merchant)
        await db.commit()
        await db.refresh(merchant)
        return merchant

    @staticmethod
    async def save(merchant: Merchant, db: AsyncSession) -> Merchant:
        """Persist changes to an attached merchant row."""
        await db.commit()
        await db.refresh(merchant)
        return merchant
