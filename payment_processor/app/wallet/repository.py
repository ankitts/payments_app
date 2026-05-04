from payments_db.models import Wallet
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

class WalletRepository:
    """
    Repository class for wallet.
    """
    @staticmethod
    async def get_by_merchant_id(merchant_id: str, db: AsyncSession) -> Wallet | None:
        """
        Repository to get a wallet by merchant id.
        """
        result = await db.execute(select(Wallet).where(Wallet.merchant_id == merchant_id))
        return result.scalar_one_or_none()

    @staticmethod
    async def update_wallet(wallet: Wallet, db: AsyncSession) -> Wallet:
        """
        Repository to update a wallet.
        """
        db.add(wallet)
        await db.commit()
        await db.refresh(wallet)
        return wallet