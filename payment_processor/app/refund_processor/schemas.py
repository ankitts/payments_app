from pydantic import BaseModel

class RefundPaymentEvent(BaseModel):
    """
    Schema for a refund payment event.
    Args:
        action (str): The action to perform.
        refund_id (str): The ID of the refund.
    """
    action: str
    refund_id: str