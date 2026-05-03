from pydantic import BaseModel, ConfigDict
from datetime import datetime


class CreatePaymentIntentRequest(BaseModel):
    """
    Schema for creating a payment intent.
    Args:
        amount (int): The amount of the payment intent.
        currency (str): The currency of the payment intent.
        order_id (str): The order ID of the payment intent.
    """
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
    """
    payment_intent_id: str
    status: str
    amount: int
    currency: str


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
    """
    id: str
    merchant_id: str
    amount: int
    currency: str
    status: str
    order_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)