from enum import Enum
import os
from dotenv import load_dotenv

load_dotenv()

def _async_database_url(url: str | None) -> str | None:
    """Use asyncpg with SQLAlchemy asyncio; plain postgresql:// resolves to a sync driver."""
    if not url:
        return url
    if url.startswith("postgresql+asyncpg://"):
        return url
    if url.startswith("postgresql://"):
        return url.replace("postgresql://", "postgresql+asyncpg://", 1)
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql+asyncpg://", 1)
    return url

DATABASE_URL = _async_database_url(os.getenv("DATABASE_URL"))


class RMQConfig(Enum):

    HOST = os.getenv("RMQ_HOST")

    PORT = int(os.getenv("RMQ_PORT"))

    USERNAME = os.getenv("RMQ_USERNAME")

    PASSWORD = os.getenv("RMQ_PASSWORD")

    EXCHANGE = os.getenv("RMQ_EXCHANGE")

    PAYMENT_PROCESSOR_ROUTING_KEY = os.getenv("PAYMENT_PROCESSOR_ROUTING_KEY")


class PaymentAppConfig(Enum):

    UPDATE_ENDPOINT = os.getenv("PAYMENT_UPDATE_ENDPOINT")


class PaymentStatus(str, Enum):

    CREATED = "CREATED"

    PROCESSING = "PROCESSING"

    SUCCESS = "SUCCESS"

    FAILED = "FAILED"

    CANCELLED = "CANCELLED"

    REFUNDED = "REFUNDED"