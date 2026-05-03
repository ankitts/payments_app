from typing import Annotated

from fastapi import APIRouter, Depends, status

from webhook.schema import PaymentWebhookRequest
from webhook.verification import verified_payment_webhook

router = APIRouter(prefix="/v1/webhook", tags=["webhook"])


@router.post("/payment", status_code=status.HTTP_200_OK)
async def payment_webhook(
    payload: Annotated[PaymentWebhookRequest, Depends(verified_payment_webhook)],
):
    print(f"Webhook received for payment: {payload}")
    return {"message": "Webhook received for payment"}
