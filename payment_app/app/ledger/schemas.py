from pydantic import BaseModel, ConfigDict
from datetime import datetime

class LedgerEntrySchema(BaseModel):
    """
    Schema for a ledger entry.
    Args:
        id (str): The ID of the ledger entry.
        merchant_id (str): The ID of the merchant.
        operation_id (str): The ID of the operation.
        entry_type (str): The type of the ledger entry.
        amount (int): The amount of the ledger entry.
        currency (str): The currency of the ledger entry.
        description (str): The description of the ledger entry.
    """
    id: str
    merchant_id: str
    operation_id: str
    entry_type: str
    amount: int
    currency: str
    description: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)