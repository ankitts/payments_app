from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from auth.dependencies import get_current_merchant
from auth.repository import MerchantRepository
from auth.schemas import (
    LoginMerchantRequest,
    LoginMerchantResponse,
    MerchantProfileResponse,
    RegisterMerchantRequest,
    RegisterMerchantResponse,
    UpdateWebhookRequest,
)
from auth.service import MerchantAuthService
from auth.utils import AuthUtils
from db.session import get_db
from payments_db.models import Merchant

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


def _merchant_profile(merchant: Merchant) -> MerchantProfileResponse:
    return MerchantProfileResponse(
        merchant_id=merchant.id,
        business_name=merchant.business_name,
        email=merchant.email,
        webhook_url=merchant.webhook_url,
        webhook_secret=merchant.webhook_secret,
        api_key=merchant.api_key,
    )


@router.get(
    "/me",
    response_model=MerchantProfileResponse,
    status_code=status.HTTP_200_OK,
)
async def get_current_profile(
    merchant: Merchant = Depends(get_current_merchant),
):
    return _merchant_profile(merchant)


@router.patch(
    "/webhook",
    response_model=MerchantProfileResponse,
    status_code=status.HTTP_200_OK,
)
async def update_webhook(
    body: UpdateWebhookRequest,
    merchant: Merchant = Depends(get_current_merchant),
    db: AsyncSession = Depends(get_db),
):
    if body.webhook_url is not None:
        merchant.webhook_url = str(body.webhook_url)
    if body.regenerate_webhook_secret:
        merchant.webhook_secret = AuthUtils.generate_webhook_secret()
    await MerchantRepository.save(merchant=merchant, db=db)
    return _merchant_profile(merchant)
