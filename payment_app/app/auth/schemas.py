from pydantic import BaseModel, HttpUrl, field_validator, model_validator


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


class MerchantProfileResponse(BaseModel):
    merchant_id: str
    business_name: str
    email: str
    webhook_url: str | None = None
    webhook_secret: str | None = None
    api_key: str


class UpdateWebhookRequest(BaseModel):
    webhook_url: HttpUrl | None = None
    regenerate_webhook_secret: bool = False

    @field_validator("webhook_url", mode="before")
    @classmethod
    def empty_string_to_none(cls, v: object) -> object:
        if v == "":
            return None
        return v

    @model_validator(mode="after")
    def non_empty_patch(self):
        if self.webhook_url is None and not self.regenerate_webhook_secret:
            raise ValueError(
                "Provide webhook_url and/or enable regenerate_webhook_secret",
            )
        return self
