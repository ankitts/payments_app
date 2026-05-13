from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError

from payments_db.models import Merchant, PaymentIntent
from payment.repository import PaymentIntentRepository
from payment.schemas import CreatePaymentIntentRequest, PaymentIntentResponse
from config import PaymentStatus
from payment.utils import PaymentUtils
from payment.schemas import PaymentIntentSchema


def _payment_intent_to_response(row: PaymentIntent) -> PaymentIntentResponse:
    return PaymentIntentResponse(
        payment_intent_id=row.id,
        status=row.status,
        amount=row.amount,
        currency=row.currency,
        order_id=row.order_id,
        created_at=row.created_at,
        refundable_amount=row.refundable_amount,
    )


class PaymentIntentService:
    """
    Service class for payment intents.
    """
    
    @staticmethod
    async def create(
        request: CreatePaymentIntentRequest,
        merchant: Merchant,
        db: AsyncSession,
    ) -> PaymentIntentResponse:
        """
        Service to create a payment intent.
        Args:
            request (CreatePaymentIntentRequest): The create payment intent request body.
            merchant (Merchant): The current merchant.
            db (AsyncSession): The database session.
        Returns:
            PaymentIntentResponse: The payment intent response.
        """
        # Check if payment intent already exists
        row = await PaymentIntentRepository.get_by_merchant_id_idempotency_key(
            merchant_id=merchant.id,
            idempotency_key=request.idempotency_key,
            db=db,
        )
        if row is not None and row.merchant_id == merchant.id:
            print("Payment intent already exists with idempotency key:", request.idempotency_key)
            if row.amount != request.amount or row.currency != request.currency or row.order_id != request.order_id:
                print("Payment intent amount, currency, or order ID does not match:", request.idempotency_key)
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Payment intent amount, currency, or order ID does not match",
                )
            
            print("Duplicate payment intent found, returning existing payment intent:", row.id)
            return _payment_intent_to_response(row)

        # Create payment intent
        row = PaymentIntent(
            merchant_id=merchant.id,
            idempotency_key=request.idempotency_key,
            amount=request.amount,
            refundable_amount=request.amount,
            currency=request.currency,
            status=PaymentStatus.CREATED.value,
            order_id=request.order_id,
        )
        try:
            row = await PaymentIntentRepository.create(payment_intent=row, db=db)
            print("Payment intent created:", row.id)
        
        except IntegrityError:
            await db.rollback()
            row = await PaymentIntentRepository.get_by_merchant_id_idempotency_key(
                merchant_id=merchant.id,
                idempotency_key=request.idempotency_key,
                db=db,
            )  
 
        return _payment_intent_to_response(row)

    @staticmethod
    async def get_by_id(
        payment_intent_id: str,
        merchant: Merchant,
        db: AsyncSession,
    ) -> PaymentIntentResponse:
        """
        Service to get a payment intent by ID.
        Args:
            payment_intent_id: The ID of the payment intent.
            merchant (Merchant): The current merchant.
            db (AsyncSession): The database session.
        Returns:
            PaymentIntentResponse: The payment intent response.
        """
        # Get payment intent by ID
        row = await PaymentIntentRepository.get_by_id(
            payment_intent_id=payment_intent_id,
            db=db,
        )
        if row is None:
            print("Payment intent not found with ID:", payment_intent_id)
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment intent not found",
            )
        if row.merchant_id != merchant.id:
            print("Payment intent does not belong to this merchant:", payment_intent_id)
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Payment intent does not belong to this merchant",
            )
        print("Payment intent found with ID:", payment_intent_id)

        return _payment_intent_to_response(row)

    @staticmethod
    async def list_for_merchant(
        merchant: Merchant,
        db: AsyncSession,
    ) -> list[PaymentIntentResponse]:
        """
        Service to list all payment intents for a merchant.
        Args:
            merchant (Merchant): The current merchant.
            db (AsyncSession): The database session.
        Returns:
            list[PaymentIntentResponse]: The list of payment intents.
        """
        # List payment intents by merchant
        rows = await PaymentIntentRepository.list_by_merchant(
            merchant_id=merchant.id,
            db=db,
        )
        print("Payment intents listed for merchant:", merchant.id)

        return [_payment_intent_to_response(r) for r in rows]

    @staticmethod
    async def confirm(
        payment_intent_id: str,
        merchant: Merchant,
        db: AsyncSession,
    ) -> PaymentIntentResponse:
        """
        Service to confirm a payment intent.
        Args:
            payment_intent_id: The ID of the payment intent.    
            merchant (Merchant): The current merchant.
            db (AsyncSession): The database session.
        Returns:
            PaymentIntentResponse: The payment intent response.
        """
        # Get payment intent by ID
        row = await PaymentIntentRepository.get_by_id(
            payment_intent_id=payment_intent_id,
            db=db,
        )
        if row is None:
            print("Payment intent not found with ID:", payment_intent_id)
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment intent not found",
            )
        if row.merchant_id != merchant.id:
            print("Payment intent does not belong to this merchant:", payment_intent_id)
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Payment intent does not belong to this merchant",
            )
        if row.status != PaymentStatus.CREATED.value:
            print("Payment status is already: ", row.status)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Payment status is already: " + row.status,
            )
        
        # Confirm payment intent
        row.status = PaymentStatus.PROCESSING.value
        row = await PaymentIntentRepository.update(payment_intent=row, db=db)

        payment_intent = PaymentIntentSchema.model_validate(row)

        # Publish payment intent to payment processor
        PaymentUtils.publish_payment_intent(payment_intent=payment_intent)

        print("Payment intent recorded for processing:", row.id)

        return _payment_intent_to_response(row)