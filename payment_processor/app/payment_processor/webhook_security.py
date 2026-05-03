import hashlib
import hmac
import time


WEBHOOK_TIMESTAMP_HEADER = "X-Webhook-Timestamp"
WEBHOOK_SIGNATURE_HEADER = "X-Webhook-Signature"


def sign_webhook_body(secret: str, body_utf8: str) -> tuple[str, str]:
    """
    Build timestamp and v1 hex signature.

    Signing string: UTF-8 bytes of ``f"{unix_seconds}.{body_utf8}"``.

    Verification (merchant):

        signing = f"{timestamp}.{request_body}".encode()
        mac = hmac.new(secret.encode(), signing, hashlib.sha256).hexdigest()
        assert hmac.compare_digest(header_signature, mac)
        # optional: enforce max age vs timestamp for replay resistance
    """
    ts = str(int(time.time()))
    signing_material = f"{ts}.{body_utf8}".encode("utf-8")
    sig = hmac.new(secret.encode("utf-8"), signing_material, hashlib.sha256).hexdigest()
    return ts, sig


def webhook_request_headers(secret: str, body_utf8: str) -> dict[str, str]:
    ts, sig = sign_webhook_body(secret, body_utf8)
    return {
        WEBHOOK_TIMESTAMP_HEADER: ts,
        WEBHOOK_SIGNATURE_HEADER: f"v1={sig}",
    }
