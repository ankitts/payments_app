from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from payments_db.models import Refund


class RefundRepository:
    """
    Repository class for refunds.
    """

    @staticmethod
    async def create(
        refund: Refund,
        db: AsyncSession,
    ) -> Refund:
        """
        Repository to create a refund.
        Args:
            refund (Refund): The refund to create.
            db (AsyncSession): The database session.
        Returns:
            Refund: The created refund.
        """
        db.add(refund)
        await db.commit()
        await db.refresh(refund)
        return refund

    @staticmethod
    async def list_by_merchant(
        merchant_id: str,
        db: AsyncSession,
    ) -> list[Refund]:
        """
        Repository to list all refunds for a merchant.
        Args:
            merchant_id (str): The ID of the merchant.
            db (AsyncSession): The database session.
        Returns:
            list[Refund]: The list of refunds.  
        """
        result = await db.execute(
            select(Refund).where(Refund.merchant_id == merchant_id)
        )
        return list[Refund](result.scalars().all())

    @staticmethod
    async def get_by_merchant_id_idempotency_key(
        merchant_id: str,
        idempotency_key: str,
        db: AsyncSession,
    ) -> Refund | None:
        """
        Repository to get a refund by merchant ID and idempotency key.
        Args:
            merchant_id (str): The ID of the merchant.
            idempotency_key (str): The idempotency key of the refund.   
            db (AsyncSession): The database session.
        Returns:
            Refund | None: The refund if found, otherwise None.
        """
        result = await db.execute(
            select(Refund).where(Refund.merchant_id == merchant_id, Refund.idempotency_key == idempotency_key)
        )
        return result.scalar_one_or_none()