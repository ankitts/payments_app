from sqlalchemy.ext.asyncio import AsyncSession
from wallet.repository import WalletRepository

class WalletService:
    """
    Service class for wallet.
    """
    @staticmethod
    async def add_to_available_balance(merchant_id: str, amount: int, db: AsyncSession) -> None:
        """
        Service to add to available balance.
        """
        wallet = await WalletRepository.get_by_merchant_id(merchant_id, db)
        if not wallet:
            print(f"Wallet not found for merchant: {merchant_id}")

        wallet.available_balance += amount
        wallet = await WalletRepository.update_wallet(wallet, db)
        print(f"Available balance updated in wallet for merchant: {merchant_id}. New balance: {wallet.available_balance}")

    @staticmethod
    async def subtract_from_available_balance(merchant_id: str, amount: int, db: AsyncSession) -> None:
        """
        Service to subtract from available balance.
        """
        wallet = await WalletRepository.get_by_merchant_id(merchant_id, db)
        if not wallet:
            print(f"Wallet not found for merchant: {merchant_id}")

        wallet.available_balance -= amount
        wallet = await WalletRepository.update_wallet(wallet, db)
        print(f"Available balance updated in wallet for merchant: {merchant_id}. New balance: {wallet.available_balance}")