from fastapi import FastAPI
import uvicorn
from auth.routes import router as auth_router
from payment.routes import router as payment_intents_router
from db.database import engine, Base
from interface.rmq_interface import RMQInterface
from config import RMQConfig

app = FastAPI()

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

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
app.include_router(payment_intents_router)

if __name__ == "__main__":
    uvicorn.run(
        app=app,
        port=8000,
    )