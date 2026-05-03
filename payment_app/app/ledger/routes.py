from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from auth.dependencies import get_current_merchant
from db.database import get_db
from db.models.merchant import Merchant
from ledger.schemas import LedgerEntrySchema
from ledger.service import LedgerService

router = APIRouter(prefix="/v1/ledger", tags=["ledger"])

@router.get(
    "",
    response_model=list[LedgerEntrySchema],
    status_code=status.HTTP_200_OK,
)
async def list_ledger_entries(
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
        return await LedgerService.list_for_merchant(
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

