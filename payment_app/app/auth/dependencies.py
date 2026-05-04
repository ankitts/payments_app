from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession

from db.session import get_db
from payments_db.models import Merchant
from auth.repository import MerchantRepository
from auth.utils import AuthUtils
from config import JWTConfig

security = HTTPBearer()

async def get_current_merchant(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db)
) -> Merchant:
    """
    Dependency to get the current merchant from the JWT token.
    Args:
        credentials (HTTPAuthorizationCredentials): The HTTP authorization credentials.
        db (AsyncSession): The database session.

    Returns:
        Merchant (Merchant): The current merchant.
    """
    try:
        payload = jwt.decode(
            credentials.credentials,
            JWTConfig.SECRET_KEY.value,
            algorithms=[JWTConfig.ALGORITHM.value]
        )
        merchant_id = payload.get("merchant_id")
        if not merchant_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Could not validate credentials"
        )

    merchant = await MerchantRepository.get_by_id(merchant_id, db)
    if not merchant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Merchant not found"
        )
    return merchant