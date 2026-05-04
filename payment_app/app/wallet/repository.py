from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from payments_db.models import Wallet


class WalletRepository:
    """
    Repository class for wallets.
    """

    @staticmethod
    async def create(
        wallet: Wallet,
        db: AsyncSession,
    ) -> Wallet:
        """
        Repository to create a wallet.
        Args:
            wallet (Wallet): The wallet to create.
            db (AsyncSession): The database session.
        Returns:
            Wallet: The created wallet.
        """
        db.add(wallet)
        await db.commit()
        await db.refresh(wallet)
        return wallet

    @staticmethod
    async def get_by_merchant_id(
        merchant_id: str,
        db: AsyncSession,
    ) -> Wallet | None:
        """
        Repository to get a wallet by merchant ID.
        Args:
            merchant_id (str): The ID of the merchant.
            db (AsyncSession): The database session.
        Returns:
            Wallet | None: The wallet if found, otherwise None.
        """
        result = await db.execute(
            select(Wallet).where(Wallet.merchant_id == merchant_id)
        )
        return result.scalar_one_or_none()