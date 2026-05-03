from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from db.models.payment import PaymentIntent

class PaymentProcessorRepository:

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
    async def update(
        payment_intent: PaymentIntent,
        db: AsyncSession,
    ) -> PaymentIntent:
        """
        Repository to update a payment intent.
        Args:
            payment_intent (PaymentIntent): The payment intent to update.
            db (AsyncSession): The database session.
        Returns:
            PaymentIntent: The updated payment intent.
        """ 
        db.add(payment_intent)
        await db.commit()
        await db.refresh(payment_intent)
        return payment_intent