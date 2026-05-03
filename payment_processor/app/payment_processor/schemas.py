from pydantic import BaseModel

class ProcessPaymentEvent(BaseModel):
    """
    Schema for a process payment event.
    Args:
        payment_intent_id (str): The ID of the payment intent.
    """
    payment_intent_id: str