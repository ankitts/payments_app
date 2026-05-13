from pydantic import BaseModel, ConfigDict
from datetime import datetime


class CreatePaymentIntentRequest(BaseModel):
    """
    Schema for creating a payment intent.
    Args:
        idempotency_key (str): The idempotency key of the payment intent.
        amount (int): The amount of the payment intent.
        currency (str): The currency of the payment intent.
        order_id (str): The order ID of the payment intent.
    """
    idempotency_key: str
    amount: int
    currency: str
    order_id: str


class PaymentIntentResponse(BaseModel):
    """
    Schema for a payment intent response.
    Args:
        payment_intent_id (str): The ID of the payment intent.
        status (str): The status of the payment intent.
        amount (int): The amount of the payment intent.
        currency (str): The currency of the payment intent.
        order_id (str): The order ID.
        created_at (datetime): When the intent was created.
        refundable_amount (int): Amount still refundable after settled refunds (<= amount).
    """
    payment_intent_id: str
    status: str
    amount: int
    currency: str
    order_id: str
    created_at: datetime
    refundable_amount: int


class PaymentIntentSchema(BaseModel):
    """
    Schema for a payment intent.
    Args:
        id (str): The ID of the payment intent.
        merchant_id (str): The ID of the merchant.
        amount (int): The amount of the payment intent.
        currency (str): The currency of the payment intent.
        status (str): The status of the payment intent.
        order_id (str): The order ID of the payment intent.
        created_at (datetime): The created at timestamp.
        updated_at (datetime): The updated at timestamp.
        refundable_amount (int): Remaining refundable total.
    """
    id: str
    merchant_id: str
    amount: int
    currency: str
    status: str
    order_id: str
    created_at: datetime
    updated_at: datetime
    refundable_amount: int

    model_config = ConfigDict(from_attributes=True)