from collections.abc import Awaitable, Callable

import aio_pika
from aio_pika import IncomingMessage
from aio_pika.abc import AbstractChannel, AbstractRobustConnection

from config import RMQConfig


class RMQInterface:
    """Async RabbitMQ client (aio-pika)."""

    def __init__(self) -> None:
        self._connection: AbstractRobustConnection | None = None
        self._channel: AbstractChannel | None = None

    async def connect(self) -> None:
        self._connection = await aio_pika.connect_robust(
            host=RMQConfig.HOST.value,
            port=RMQConfig.PORT.value,
            login=RMQConfig.USERNAME.value,
            password=RMQConfig.PASSWORD.value,
        )
        self._channel = await self._connection.channel()
        await self._channel.set_qos(prefetch_count=1)

    async def close(self) -> None:
        if self._channel is not None:
            await self._channel.close()
            self._channel = None
        if self._connection is not None:
            await self._connection.close()
            self._connection = None

    def _require_channel(self) -> AbstractChannel:
        if self._channel is None:
            raise RuntimeError("Not connected; call connect() first")
        return self._channel

    async def publish(self, exchange: str, routing_key: str, message: str) -> None:
        ch = self._require_channel()
        exch = await ch.declare_exchange(
            exchange,
            aio_pika.ExchangeType.DIRECT,
            durable=True,
        )
        await exch.publish(
            aio_pika.Message(body=message.encode("utf-8")),
            routing_key=routing_key,
        )
        print("Message published to RabbitMQ with routing key:", routing_key)

    async def declare_exchange(self, exchange: str) -> aio_pika.RobustExchange:
        """
        Declare a direct durable exchange.

        Args:
            exchange: Exchange name.

        Returns:
            The declared exchange handle (for bindings).
        """
        ch = self._require_channel()
        ex = await ch.declare_exchange(
            exchange,
            aio_pika.ExchangeType.DIRECT,
            durable=True,
        )
        print("Exchange declared:", exchange)
        return ex

    async def declare_queue(self, queue: str) -> aio_pika.RobustQueue:
        ch = self._require_channel()
        q = await ch.declare_queue(queue, durable=True)
        print("Queue declared:", queue)
        return q

    async def bind_queue(
        self,
        queue: aio_pika.RobustQueue,
        exchange: aio_pika.RobustExchange,
        routing_key: str,
    ) -> None:
        await queue.bind(exchange, routing_key=routing_key)
        print(
            f"Queue {queue.name} bound to exchange {exchange.name} "
            f"with routing key {routing_key}"
        )

    async def consume(
        self,
        queue: aio_pika.RobustQueue,
        callback: Callable[[IncomingMessage], Awaitable[None]],
    ) -> str:
        """
        Subscribe to queue messages.

        Callback must be async. Use IncomingMessage ack/reject explicitly if not using
        message.process().
        """
        tag = await queue.consume(callback, no_ack=False)
        print("Consumer started for queue:", queue.name)
        return tag
