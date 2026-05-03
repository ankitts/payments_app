from pydantic import BaseModel
from datetime import datetime

class PaymentWebhookRequest(BaseModel):
    """
    Schema for a payment webhook request.
    Args:
        payment_intent_id (str): The ID of the payment intent.
        amount (int): The amount of the payment intent.
        currency (str): The currency of the payment intent.
        status (str): The status of the payment intent.
        order_id (str): The order ID of the payment intent.
        created_at (datetime): The created at timestamp.
        updated_at (datetime): The updated at timestamp.
    """
    payment_intent_id: str
    amount: int
    currency: str
    status: str
    order_id: str
    created_at: datetime
    updated_at: datetime
