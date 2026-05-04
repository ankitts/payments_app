"""Schema creation for hobby/local setups. Prefer Alembic for production migrations."""

from sqlalchemy.ext.asyncio import AsyncEngine


async def ensure_schema(engine: AsyncEngine) -> None:
    import payments_db.models  # noqa: F401  # registers tables on Base.metadata
    from payments_db.base import Base

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
