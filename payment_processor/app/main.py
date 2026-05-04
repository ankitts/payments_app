import asyncio
import json

import aio_pika
from config import RMQConfig
from db.session import engine
from payments_db.bootstrap import ensure_schema
from interface.rmq_interface import RMQInterface
from payment_processor.service import PaymentProcessor
from payment_processor.schemas import ProcessPaymentEvent
from refund_processor.service import RefundProcessor
from refund_processor.schemas import RefundPaymentEvent
from pydantic import ValidationError


async def _handle_delivery(message: aio_pika.IncomingMessage) -> None:
    try:
        text = message.body.decode("utf-8")
        payload = json.loads(text)
        if payload["action"] == "PAYMENT":
            process_payment_event = ProcessPaymentEvent(**payload)
            result = await PaymentProcessor.process_payment(process_payment_event)
        elif payload["action"] == "REFUND":
            refund_payment_event = RefundPaymentEvent(**payload)
            result = await RefundProcessor.refund_payment(refund_payment_event)
        else:
            print(f"Invalid action: {payload['action']}")
            await message.ack()
            return
        
        if result["status"] == "success":
            await message.ack()
        else:
            raise RuntimeError(result.get("message", "processing failed"))

    except json.JSONDecodeError as exc:
        print("Invalid JSON payload:", exc)
        await message.reject(requeue=False)

    except ValidationError as exc:
        print("Invalid payload:", exc)
        await message.reject(requeue=False)

    except Exception as exc:
        await message.reject(requeue=False)
        print("Payment consumer handler failed:", exc)


async def run_consumer() -> None:
    await ensure_schema(engine)

    rmq_interface = RMQInterface()
    await rmq_interface.connect()
    try:
        exchange = await rmq_interface.declare_exchange(
            exchange=RMQConfig.EXCHANGE.value,
        )
        queue_name = RMQConfig.PAYMENT_PROCESSOR_ROUTING_KEY.value
        queue_obj = await rmq_interface.declare_queue(queue=queue_name)
        await rmq_interface.bind_queue(
            queue=queue_obj,
            exchange=exchange,
            routing_key=RMQConfig.PAYMENT_PROCESSOR_ROUTING_KEY.value,
        )
        await rmq_interface.bind_queue(
            queue=queue_obj,
            exchange=exchange,
            routing_key=RMQConfig.REFUND_PROCESSOR_ROUTING_KEY.value,
        )
        await rmq_interface.consume(queue=queue_obj, callback=_handle_delivery)
        await asyncio.Future()
    finally:
        await rmq_interface.close()


def main() -> None:
    asyncio.run(run_consumer())


if __name__ == "__main__":
    main()
