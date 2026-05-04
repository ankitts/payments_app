from pydantic import BaseModel, ConfigDict
from datetime import datetime


class CreateRefundRequest(BaseModel):
    """
    Schema for a create refund request.
    Args:
        idempotency_key (str): The idempotency key of the refund.
        payment_intent_id (str): The ID of the payment intent.
        amount (int): The amount of the refund.
        reason (str): The reason for the refund.
    """
    idempotency_key: str
    payment_intent_id: str
    amount: int
    reason: str


class CreateRefundResponse(BaseModel):
    """
    Schema for a refund response.
    Args:
        refund_id (str): The ID of the refund.
        status (str): The status of the refund.
    """
    refund_id: str
    status: str


class RefundSchema(BaseModel):
    """
    Schema for a refund.
    Args:
        id (str): The ID of the refund.
        merchant_id (str): The ID of the merchant.
        payment_intent_id (str): The ID of the payment intent.
        amount (int): The amount of the refund.
        currency (str): The currency of the refund.
        status (str): The status of the refund.
        reason (str): The reason for the refund.
        created_at (datetime): The created at timestamp.
        updated_at (datetime): The updated at timestamp.
    """
    id: str
    merchant_id: str
    payment_intent_id: str
    amount: int
    currency: str
    status: str
    reason: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)