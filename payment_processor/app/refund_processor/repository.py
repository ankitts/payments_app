from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from payments_db.models import Refund

class RefundRepository:

    @staticmethod
    async def get_by_id(
        refund_id: str,
        db: AsyncSession,
    ) -> Refund | None:
        """
        Get a refund by id.
        Args:
            refund_id (str): The ID of the refund.
            db (AsyncSession): The database session.
        Returns:
            Refund | None: The refund if found, otherwise None.
        """
        result = await db.execute(
            select(Refund).where(Refund.id == refund_id)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def update(
        refund: Refund,
        db: AsyncSession,
    ) -> Refund:
        """Persist updates to an existing refund."""
        db.add(refund)
        await db.commit()
        await db.refresh(refund)
        return refund
