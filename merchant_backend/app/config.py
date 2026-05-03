import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent / ".env")

WEBHOOK_SECRET = os.getenv("WEBHOOK_SECRET")
WEBHOOK_MAX_AGE_SECONDS = int(os.getenv("WEBHOOK_MAX_AGE_SECONDS", "300"))
