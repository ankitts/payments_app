from pika import BlockingConnection, ConnectionParameters
from pika.credentials import PlainCredentials
from config import RMQConfig

class RMQInterface:
    """
    Interface class for RabbitMQ.
    """

    def __init__(self):
        credentials = PlainCredentials(RMQConfig.USERNAME.value, RMQConfig.PASSWORD.value)
        self.connection = BlockingConnection(
            ConnectionParameters(
                host=RMQConfig.HOST.value,
                port=RMQConfig.PORT.value,
                credentials=credentials,
            )
        )
        self.channel = self.connection.channel()

    def publish(self, exchange: str, routing_key: str, message: str):
        """
        Publish a message to a RabbitMQ exchange.
        Args:
            exchange (str): The exchange to publish the message to.
            routing_key (str): The routing key to use for the message.
            message (str): The message to publish.
        """
        self.channel.basic_publish(exchange, routing_key, message)
        print("Message published to RabbitMQ with routing key:", routing_key)

    def declare_exchange(self, exchange: str):
        """
        Declare a RabbitMQ exchange.
        Args:
            exchange (str): The exchange to declare.
        """
        self.channel.exchange_declare(exchange=exchange, exchange_type="direct", durable=True)
        print("Exchange declared:", exchange)

    def declare_queue(self, queue: str):
        """
        Declare a RabbitMQ queue.
        Args:
            queue (str): The queue to declare.
        """
        self.channel.queue_declare(queue=queue, durable=True)
        print("Queue declared:", queue)

    def bind_queue(self, queue: str, exchange: str, routing_key: str):
        """
        Bind a RabbitMQ queue to an exchange.
        Args:
            queue (str): The queue to bind.
            exchange (str): The exchange to bind to.
            routing_key (str): The routing key to use for the binding.
        """
        self.channel.queue_bind(queue=queue, exchange=exchange, routing_key=routing_key)
        print(f"Queue {queue} bound to exchange {exchange} with routing key {routing_key}")

    def consume(self, queue: str, callback: callable):
        """
        Consume a message from a RabbitMQ queue.
        Args:
            queue (str): The queue to consume from.
        """
        self.channel.basic_consume(queue=queue, on_message_callback=callback, auto_ack=False)
        print("Consumer started for queue:", queue)
        self.channel.start_consuming()