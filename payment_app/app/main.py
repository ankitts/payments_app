import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from auth.routes import router as auth_router
from payment.routes import router as payments_router
from ledger.routes import router as ledger_router
from wallet.routes import router as wallet_router
from refund.routes import router as refunds_router
from config import RMQConfig
from db.session import engine
from interface.rmq_interface import RMQInterface
from payments_db.bootstrap import ensure_schema

app = FastAPI()

# Browsers treat localhost vs 127.0.0.1 as different origins; include both by default for dev.
_default_cors = (
    "http://localhost:3000"
)
_cors_origins = [
    o.strip()
    for o in os.getenv("CORS_ORIGINS", _default_cors).split(",")
    if o.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    await ensure_schema(engine)

    rmq_interface = RMQInterface()
    rmq_interface.declare_exchange(
        exchange=RMQConfig.EXCHANGE.value
    )
    rmq_interface.declare_queue(
        queue=RMQConfig.PAYMENT_PROCESSOR_ROUTING_KEY.value
    )
    rmq_interface.bind_queue(
        queue=RMQConfig.PAYMENT_PROCESSOR_ROUTING_KEY.value, 
        exchange=RMQConfig.EXCHANGE.value,
        routing_key=RMQConfig.PAYMENT_PROCESSOR_ROUTING_KEY.value,
    )

@app.get("/")
async def health():
    return {"message": "Health is fine."}

app.include_router(auth_router)
app.include_router(payments_router)
app.include_router(ledger_router)
app.include_router(wallet_router)
app.include_router(refunds_router)

if __name__ == "__main__":
    uvicorn.run(
        app=app,
        port=8000,
    )