from pydantic import BaseModel


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
