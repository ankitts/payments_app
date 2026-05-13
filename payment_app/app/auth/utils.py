from typing import Optional
import bcrypt
import secrets
from jose import jwt
from datetime import datetime, timezone, timedelta

from config import JWTConfig

class AuthUtils:
    """
    Utility class for authentication.
    """
        
    @staticmethod
    def hash_password(password: str) -> str:
        """
        Utility to hash a password.
        Args:
            password (str): The password to hash.
        Returns:
            str: The hashed password.
        """
        return bcrypt.hashpw(
            password=password.encode("utf-8"),
            salt=bcrypt.gensalt()
        ).decode("utf-8")
    
    
    @staticmethod
    def verify_password(password: str, hashed_password: str) -> bool:
        """
        Utility to verify a password.
        Args:
            password (str): The password to verify.
            hashed_password (str): The hashed password to verify.
        Returns:
            bool: Whether the password is verified.
        """
        return bcrypt.checkpw(
            password=password.encode("utf-8"),
            hashed_password=hashed_password.encode("utf-8")
        )
    
    @staticmethod
    def generate_webhook_secret() -> str:
        """Generate a new webhook signing secret (HMAC key)."""
        return f"whsec_{secrets.token_urlsafe(32)}"

    @staticmethod
    def generate_api_key() -> str:
        """
        Utility to generate an API key.
        Returns:
            str: The generated API key.
        """
        api_key = f"pk_test_{secrets.token_urlsafe(32)}"
        return api_key
    
    @staticmethod
    def create_access_token(data: dict) -> str:
        """
        Utility to create an access token.
        Args:
            data (dict): The data to encode.
        Returns:
            str: The created access token.
        """
        to_encode = data.copy()

        expire = datetime.now(timezone.utc) + timedelta(
            minutes=JWTConfig.ACCESS_TOKEN_EXPIRE_MINUTES.value
        )

        to_encode.update({
            "exp": expire
        })

        return jwt.encode(
            to_encode,
            JWTConfig.SECRET_KEY.value,
            algorithm=JWTConfig.ALGORITHM.value
        )
