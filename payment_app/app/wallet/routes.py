from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from auth.dependencies import get_current_merchant
from db.session import get_db
from payments_db.models import Merchant
from wallet.schemas import WalletSchema
from wallet.service import WalletService

router = APIRouter(prefix="/v1/wallet", tags=["wallet"])

@router.get(
    "",
    response_model=WalletSchema,
    status_code=status.HTTP_200_OK,
)
async def get_wallet(
    merchant: Merchant = Depends(get_current_merchant),
    db: AsyncSession = Depends(get_db),
):
    """
    Route to list all ledger entries for a merchant.
    Args:
        merchant (Merchant): The current merchant.
        db (AsyncSession): The database session.
    Returns:
        list[LedgerEntrySchema]: The list of ledger entries.
    """
    try:
        return await WalletService.get_for_merchant(
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

