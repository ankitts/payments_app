from pydantic import BaseModel


class RegisterMerchantRequest(BaseModel):
    """
    Schema for registering a merchant.
    Args:
        business_name (str): The business name of the merchant.
        email (str): The email of the merchant.
        password (str): The password of the merchant.
    """
    business_name: str
    email: str
    password: str
    webhook_url: str | None = None
    webhook_secret: str | None = None


class RegisterMerchantResponse(BaseModel):
    """
    Schema for registering a merchant response.
    Args:
        success (bool): Whether the merchant was registered successfully.
        message (str): The message of the merchant.
        merchant_id (str): The ID of the merchant.
        business_name (str): The business name of the merchant.
        email (str): The email of the merchant.
        api_key (str): The API key of the merchant.
        created_at (str): The created at timestamp of the merchant.
    """
    success: bool
    message: str
    merchant_id: str
    business_name: str
    email: str
    api_key: str
    created_at: str


class LoginMerchantRequest(BaseModel):
    """
    Schema for logging in a merchant.
    Args:
        email (str): The email of the merchant.
        password (str): The password of the merchant.
    """
    email: str
    password: str


class LoginMerchantResponse(BaseModel):
    """
    Schema for logging in a merchant response.
    Args:
        success (bool): Whether the merchant was logged in successfully.
        message (str): The message of the merchant.
        access_token (str): The access token of the merchant.
        token_type (str): The type of the token.
    """
    success: bool
    message: str
    access_token: str
    token_type: str = "Bearer"
