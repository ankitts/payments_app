from datetime import datetime, timezone
from enum import Enum as PyEnum
from uuid import uuid4

from sqlalchemy import DateTime, Enum as SQLEnum, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from db.database import Base


class LedgerEntryType(str, PyEnum):
    DEBIT = "DEBIT"
    CREDIT = "CREDIT"


class LedgerEntry(Base):
    __tablename__ = "ledger_entry"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid4()),
    )

    merchant_id: Mapped[str] = mapped_column(
        String(36),
        nullable=False,
    )

    payment_intent_id: Mapped[str] = mapped_column(
        String(36),
        nullable=False,
    )

    entry_type: Mapped[LedgerEntryType] = mapped_column(
        SQLEnum(LedgerEntryType),
        nullable=False,
    )

    amount: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    currency: Mapped[str] = mapped_column(
        String(3),
        nullable=False,
    )

    description: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
