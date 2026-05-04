from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from auth.dependencies import get_current_merchant
from db.session import get_db
from payments_db.models import Merchant
from refund.schemas import CreateRefundRequest, CreateRefundResponse, RefundSchema
from refund.service import RefundService

router = APIRouter(prefix="/v1/refunds", tags=["refunds"])

@router.post(
    "/create",
    response_model=CreateRefundResponse,
    status_code=status.HTTP_200_OK,
)
async def create_refund(
    body: CreateRefundRequest,
    merchant: Merchant = Depends(get_current_merchant),
    db: AsyncSession = Depends(get_db),
):
    """
    Route to create a refund.
    Args:
        body (CreateRefundRequest): The create refund request body.
        merchant (Merchant): The current merchant.
        db (AsyncSession): The database session.
    Returns:
        CreateRefundResponse: The create refund response.
    """
    try:
        return await RefundService.initiate_refund(
            request=body,
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
    response_model=List[RefundSchema],
    status_code=status.HTTP_200_OK,
)
async def get_refunds(
    merchant: Merchant = Depends(get_current_merchant),
    db: AsyncSession = Depends(get_db),
):
    """
    Route to get all refunds for a merchant.
    Args:
        merchant (Merchant): The current merchant.
        db (AsyncSession): The database session.
    Returns:
        List[RefundSchema]: The list of refunds.
    """
    try:
        return await RefundService.get_for_merchant(
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