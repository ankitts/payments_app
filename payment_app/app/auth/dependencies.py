from fastapi import Depends, Header, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession

from db.session import get_db
from payments_db.models import Merchant
from auth.repository import MerchantRepository
from auth.utils import AuthUtils
from config import JWTConfig

security = HTTPBearer(auto_error=False)


async def get_current_merchant(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    x_api_key: str | None = Header(None, alias="X-API-Key"),
    db: AsyncSession = Depends(get_db),
) -> Merchant:
    """
    Resolve the current merchant from either a JWT Bearer token or a merchant API key.

    API keys may be sent as ``Authorization: Bearer <api_key>`` or ``X-API-Key: <api_key>``.
    JWTs continue to use ``Authorization: Bearer <jwt>``.
    """
    token: str | None = None
    if credentials and credentials.scheme.lower() == "bearer":
        token = credentials.credentials
    elif x_api_key is not None and (stripped := x_api_key.strip()):
        token = stripped

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    if token.startswith(AuthUtils.API_KEY_PREFIX):
        merchant = await MerchantRepository.get_by_api_key(token, db)
        if not merchant:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid API key",
            )
        return merchant

    try:
        payload = jwt.decode(
            token,
            JWTConfig.SECRET_KEY.value,
            algorithms=[JWTConfig.ALGORITHM.value],
        )
        merchant_id = payload.get("merchant_id")
        if not merchant_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
            )

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )

    merchant = await MerchantRepository.get_by_id(merchant_id, db)
    if not merchant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Merchant not found",
        )
    return merchant