from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from payments_db.models import Merchant, PaymentIntent

class PaymentIntentRepository:

    @staticmethod
    async def get_by_id(
        payment_intent_id: str,
        db: AsyncSession,
    ) -> PaymentIntent | None:
        """
        Get a payment intent by id.
        Args:
            payment_intent_id (str): The ID of the payment intent.
            db (AsyncSession): The database session.
        Returns:
            PaymentIntent | None: The payment intent if found, otherwise None.
        """
        result = await db.execute(
            select(PaymentIntent).where(PaymentIntent.id == payment_intent_id)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def update(
        payment_intent: PaymentIntent,
        db: AsyncSession,
    ) -> PaymentIntent:
        """Persist updates to an existing payment intent."""
        db.add(payment_intent)
        await db.commit()
        await db.refresh(payment_intent)
        return payment_intent


class MerchantRepository:

    @staticmethod
    async def get_by_id(
        merchant_id: str,
        db: AsyncSession,
    ) -> Merchant | None:
        """
        Repository to get a merchant by ID.
        """ 
        result = await db.execute(select(Merchant).where(Merchant.id == merchant_id))
        return result.scalar_one_or_none()