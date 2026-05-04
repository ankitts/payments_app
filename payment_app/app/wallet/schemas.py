from pydantic import BaseModel, ConfigDict
from datetime import datetime

class WalletSchema(BaseModel):
    """
    Schema for a wallet.
    Args:
        id (str): The ID of the wallet.
        merchant_id (str): The ID of the merchant.
        available_balance (int): The available balance of the wallet.
        pending_balance (int): The pending balance of the wallet.
        currency (str): The currency of the wallet.
    """
    id: str
    merchant_id: str
    available_balance: int
    pending_balance: int
    currency: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)