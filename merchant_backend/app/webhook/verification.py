"""Verify webhooks emitted by ``payment_processor`` (see webhook_security.sign_webhook_body)."""

import hashlib
import hmac
import time

from fastapi import HTTPException, Request, status
from pydantic import ValidationError

from config import WEBHOOK_MAX_AGE_SECONDS, WEBHOOK_SECRET
from webhook.schema import PaymentWebhookRequest


# Headers the payment processor sets on outbound webhooks; must stay in sync with issuer code.
WEBHOOK_TIMESTAMP_HEADER = "X-Webhook-Timestamp"
WEBHOOK_SIGNATURE_HEADER = "X-Webhook-Signature"


def _parse_v1_signature(header_value: str) -> str | None:
    # Normalize `X-Webhook-Signature`; we currently only accept the `v1=<hex.digest>` scheme.
    if not header_value:
        return None
    prefix = "v1="
    if header_value.startswith(prefix):
        return header_value[len(prefix) :]
    return None


def _timestamp_fresh(timestamp: str, *, max_age_seconds: int) -> None:
    # Reject non-numeric or stale timestamps so replayed requests cannot be reused indefinitely.
    try:
        ts = int(timestamp)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid X-Webhook-Timestamp",
        ) from exc

    age = abs(int(time.time()) - ts)
    if age > max_age_seconds:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Webhook timestamp outside allowed window",
        )


async def verified_payment_webhook(request: Request) -> PaymentWebhookRequest:
    """
    Read raw body, verify HMAC (same secret as merchant ``webhook_secret`` in DB).
    Must match the issuer: ``timestamp + '.' + utf8_json_body``.
    """
    # Misconfiguration guard: verifying without a shared secret would accept forgeries.
    if not WEBHOOK_SECRET:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="WEBHOOK_SECRET is not configured",
        )

    # Both headers are required before we read the body (cheap checks first).
    ts = request.headers.get(WEBHOOK_TIMESTAMP_HEADER)
    sig_hdr = request.headers.get(WEBHOOK_SIGNATURE_HEADER)
    if ts is None or sig_hdr is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing webhook signature headers",
        )

    # Extract the advertised digest; anything other than `v1=` is rejected.
    expected_hex = _parse_v1_signature(sig_hdr.strip())
    if not expected_hex:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid X-Webhook-Signature format (expected v1=<hex>)",
        )

    _timestamp_fresh(ts, max_age_seconds=WEBHOOK_MAX_AGE_SECONDS)

    # Body bytes must match the UTF-8 string the sender signed (`timestamp + '.' + json`).
    raw = await request.body()
    body_text = raw.decode("utf-8")

    # Same HMAC as payment_processor: SHA-256(secret, UTF-8 of `ts + '.' + body`).
    signing_material = f"{ts}.{body_text}".encode("utf-8")
    computed = hmac.new(
        WEBHOOK_SECRET.encode("utf-8"),
        signing_material,
        hashlib.sha256,
    ).hexdigest()

    if not hmac.compare_digest(expected_hex, computed):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid webhook signature",
        )

    # Signature covers the payload; only then parse JSON into the API schema.
    try:
        return PaymentWebhookRequest.model_validate_json(raw)
    except ValidationError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=exc.errors(),
        ) from exc
