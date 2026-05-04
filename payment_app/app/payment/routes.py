from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from auth.dependencies import get_current_merchant
from db.session import get_db
from payments_db.models import Merchant
from payment.schemas import CreatePaymentIntentRequest, PaymentIntentResponse
from payment.service import PaymentIntentService

router = APIRouter(prefix="/v1/payment-intents", tags=["payment-intents"])


@router.post(
    "",
    response_model=PaymentIntentResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_payment_intent(
    body: CreatePaymentIntentRequest,
    merchant: Merchant = Depends(get_current_merchant),
    db: AsyncSession = Depends(get_db),
):
    """
    Route to create a payment intent.
    Args:
        body (CreatePaymentIntentRequest): The create payment intent request body.
        merchant (Merchant): The current merchant.
        db (AsyncSession): The database session.
    Returns:
        PaymentIntentResponse: The payment intent response.
    """
    try:
        return await PaymentIntentService.create(
            request=body,
            merchant=merchant,
            db=db,
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error creating payment intent: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        )


@router.get(
    "/{payment_intent_id}",
    response_model=PaymentIntentResponse,
    status_code=status.HTTP_200_OK,
)
async def get_payment_intent(
    payment_intent_id: str,
    merchant: Merchant = Depends(get_current_merchant),
    db: AsyncSession = Depends(get_db),
):
    """
    Route to get a payment intent by ID.
    Args:
        payment_intent_id: The ID of the payment intent.
        merchant (Merchant): The current merchant.
        db (AsyncSession): The database session.
    Returns:
        PaymentIntentResponse: The payment intent response.
    """
    try:
        return await PaymentIntentService.get_by_id(
            payment_intent_id=payment_intent_id,
            merchant=merchant,
            db=db,
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        )


@router.get(
    "",
    response_model=list[PaymentIntentResponse],
    status_code=status.HTTP_200_OK,
)
async def list_payment_intents(
    merchant: Merchant = Depends(get_current_merchant),
    db: AsyncSession = Depends(get_db),
):
    """
    Route to list all payment intents for a merchant.
    Args:
        merchant (Merchant): The current merchant.
        db (AsyncSession): The database session.
    Returns:
        list[PaymentIntentResponse]: The list of payment intents.
    """
    try:
        return await PaymentIntentService.list_for_merchant(
            merchant=merchant,
            db=db,
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        )


@router.post(
    "/{payment_intent_id}/confirm",
    status_code=status.HTTP_200_OK,
)
async def confirm_payment_intent(
    payment_intent_id: str,
    merchant: Merchant = Depends(get_current_merchant),
    db: AsyncSession = Depends(get_db),
):
    """
    Route to confirm a payment intent.
    Args:
        payment_intent_id: The ID of the payment intent.
        merchant (Merchant): The current merchant.
        db (AsyncSession): The database session.
    Returns:
        PaymentIntentResponse: The payment intent response.
    """
    try:
        return await PaymentIntentService.confirm(
            payment_intent_id=payment_intent_id,
            merchant=merchant,
            db=db,
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error confirming payment intent: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        )