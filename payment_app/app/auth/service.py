from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from auth.repository import MerchantRepository
from auth.schemas import (
    LoginMerchantRequest,
    LoginMerchantResponse,
    RegisterMerchantRequest,
    RegisterMerchantResponse,
)
from auth.utils import AuthUtils
from payments_db.models import Merchant
from wallet.repository import WalletRepository
from payments_db.models import Wallet


class MerchantAuthService:
    """
    Service class for merchant authentication.
    """

    @staticmethod
    async def register(
        body: RegisterMerchantRequest,
        db: AsyncSession,
    ) -> RegisterMerchantResponse:
        """
        Service to register a merchant.
        Args:
            body (RegisterMerchantRequest): The register merchant request body.
            db (AsyncSession): The database session.
        Returns:
            RegisterMerchantResponse: The register merchant response.
        """
        # Check if merchant already exists
        existing = await MerchantRepository.get_by_email(body.email, db)
        if existing:
            print("Merchant already registered with email:", body.email)
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Merchant already registered",
            )

        # Hash password and generate API key
        hashed_password = AuthUtils.hash_password(password=body.password)
        api_key = AuthUtils.generate_api_key()

        # Create merchant
        merchant = Merchant(
            business_name=body.business_name,
            email=body.email,
            hashed_password=hashed_password,
            api_key=api_key,
            webhook_url=body.webhook_url,
            webhook_secret=body.webhook_secret,
        )
        merchant = await MerchantRepository.create(merchant=merchant, db=db)
        print("Merchant created:", body.email)

        # Create wallet for merchant
        wallet = Wallet(
            merchant_id=merchant.id,
            available_balance=0,
            pending_balance=0,
            currency="INR",
        )
        wallet = await WalletRepository.create(wallet=wallet, db=db)

        return RegisterMerchantResponse(
            success=True,
            message="Merchant registered successfully",
            merchant_id=merchant.id,
            business_name=merchant.business_name,
            email=merchant.email,
            api_key=merchant.api_key,
            created_at=merchant.created_at.isoformat(),
        )

    @staticmethod
    async def login(
        body: LoginMerchantRequest,
        db: AsyncSession,
    ) -> LoginMerchantResponse:
        """
        Service to login a merchant.
        Args:
            body (LoginMerchantRequest): The login merchant request body.
            db (AsyncSession): The database session.
        Returns:
            LoginMerchantResponse: The login merchant response.
        """
        # Get merchant by email
        merchant = await MerchantRepository.get_by_email(body.email, db)
        if not merchant:
            print("Merchant not found with email:", body.email)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )
        print("Merchant found with email:", body.email)

        # Verify password
        if not AuthUtils.verify_password(
            password=body.password,
            hashed_password=merchant.hashed_password,
        ):
            print("Invalid password for merchant:", body.email)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )
        print("Password verified for merchant:", body.email)

        # Check if merchant is active
        if not merchant.is_active:
            print("Merchant account inactive:", body.email)
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Merchant account inactive",
            )
        print("Merchant account active:", body.email)

        # Create access token
        access_token = AuthUtils.create_access_token(
            data={"merchant_id": merchant.id, "email": merchant.email}
        )
        print("Access token created for merchant:", body.email)

        return LoginMerchantResponse(
            success=True,
            message="Login successful",
            access_token=access_token,
        )
