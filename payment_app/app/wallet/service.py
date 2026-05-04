from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from payments_db.models import Merchant
from wallet.schemas import WalletSchema
from wallet.repository import WalletRepository


class WalletService:
    """
    Service class for wallets.
    """
    @staticmethod
    async def get_for_merchant(
        merchant: Merchant,
        db: AsyncSession,
    ) -> WalletSchema:
        """
        Service to get a wallet for a merchant.
        Args:
            merchant (Merchant): The current merchant.
            db (AsyncSession): The database session.
        Returns:
            WalletSchema: The wallet.
        """
        # List payment intents by merchant
        wallet = await WalletRepository.get_by_merchant_id(
            merchant_id=merchant.id,
            db=db,
        )
        if not wallet:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Wallet not found",
            )
        print("Wallet get for merchant:", merchant.id)

        return WalletSchema(
            id=wallet.id,
            merchant_id=wallet.merchant_id,
            available_balance=wallet.available_balance,
            pending_balance=wallet.pending_balance,
            currency=wallet.currency,
            created_at=wallet.created_at,
            updated_at=wallet.updated_at,
        )