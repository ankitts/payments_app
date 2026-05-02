from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from auth.schemas import (
    LoginMerchantRequest,
    LoginMerchantResponse,
    RegisterMerchantRequest,
    RegisterMerchantResponse,
)
from auth.service import MerchantAuthService
from db.database import get_db

router = APIRouter(prefix="/v1/auth", tags=["auth"])


@router.post(
    "/register",
    response_model=RegisterMerchantResponse,
    status_code=status.HTTP_201_CREATED,
)
async def register_merchant(
    body: RegisterMerchantRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Route to register a merchant.
    Args:
        body (RegisterMerchantRequest): The register merchant request body.
        db (AsyncSession): The database session.
    Returns:
        RegisterMerchantResponse: The register merchant response.
    """
    try:
        return await MerchantAuthService.register(body=body, db=db)
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        )


@router.post(
    "/login",
    response_model=LoginMerchantResponse,
    status_code=status.HTTP_200_OK,
)
async def login_merchant(
    body: LoginMerchantRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Route to login a merchant.
    Args:
        body (LoginMerchantRequest): The login merchant request body.
        db (AsyncSession): The database session.
    Returns:
        LoginMerchantResponse: The login merchant response.
    """
    try:
        return await MerchantAuthService.login(body=body, db=db)
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        )
