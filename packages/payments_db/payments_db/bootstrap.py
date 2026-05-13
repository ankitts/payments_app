"""Schema creation for hobby/local setups. Prefer Alembic for production migrations."""

from sqlalchemy import inspect, text

from sqlalchemy.ext.asyncio import AsyncEngine


def _migrate_payment_refundable(sync_conn) -> None:
    """Add payment_intents.refundable_amount when missing (pre-Alembic DBs)."""
    inspector = inspect(sync_conn)
    if "payment_intents" not in inspector.get_table_names():
        return
    cols = {c["name"] for c in inspector.get_columns("payment_intents")}
    if "refundable_amount" in cols:
        return
    sync_conn.execute(
        text("ALTER TABLE payment_intents ADD COLUMN refundable_amount INTEGER")
    )
    sync_conn.execute(
        text(
            "UPDATE payment_intents SET refundable_amount = amount "
            "WHERE refundable_amount IS NULL"
        )
    )


async def ensure_schema(engine: AsyncEngine) -> None:
    import payments_db.models  # noqa: F401  # registers tables on Base.metadata
    from payments_db.base import Base

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        await conn.run_sync(_migrate_payment_refundable)
