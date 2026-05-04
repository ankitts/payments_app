from pydantic import BaseModel

class ProcessPaymentEvent(BaseModel):
    """
    Schema for a process payment event.
    Args:
        action (str): The action to perform.
        payment_intent_id (str): The ID of the payment intent.
    """
    action: str
    payment_intent_id: str
