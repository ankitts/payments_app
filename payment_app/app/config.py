from dotenv import load_dotenv
import os
from enum import Enum 

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

class JWTConfig(Enum):

    SECRET_KEY = "supersecret"

    ALGORITHM = "HS256"
    
    ACCESS_TOKEN_EXPIRE_MINUTES = 60