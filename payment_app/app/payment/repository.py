from db.models.payment import PaymentIntent


from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from db.models.payment import PaymentIntent


class PaymentIntentRepository:
    """
    Repository class for payment intents.
    """

    @staticmethod
    async def create(
        payment_intent: PaymentIntent,
        db: AsyncSession,
    ) -> PaymentIntent:
        """
        Repository to create a payment intent.
        Args:
            payment_intent (PaymentIntent): The payment intent to create.
            db (AsyncSession): The database session.
        Returns:
            PaymentIntent: The created payment intent.
        """
        db.add(payment_intent)
        await db.commit()
        await db.refresh(payment_intent)
        return payment_intent

    @staticmethod
    async def get_by_id(
        payment_intent_id: str,
        db: AsyncSession,
    ) -> PaymentIntent | None:
        """
        Repository to get a payment intent by ID.
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
    async def list_by_merchant(
        merchant_id: str,
        db: AsyncSession,
    ) -> list[PaymentIntent]:
        """
        Repository to list all payment intents for a merchant.
        Args:
            merchant_id (str): The ID of the merchant.
            db (AsyncSession): The database session.
        Returns:
            list[PaymentIntent]: The list of payment intents.
        """
        result = await db.execute(
            select(PaymentIntent).where(PaymentIntent.merchant_id == merchant_id)
        )
        return list[PaymentIntent](result.scalars().all())
    