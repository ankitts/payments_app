import json

from interface.rmq_interface import RMQInterface
from payment.schemas import PaymentIntentSchema
from config import RMQConfig

class PaymentUtils:
    """
    Utility class for payments.
    """

    @staticmethod
    def publish_payment_intent(payment_intent: PaymentIntentSchema) -> None:
        """
        Publish a payment intent to the payment processor.
        Args:
            payment_intent (PaymentIntent): The payment intent to publish.
        """
        try:
            rmq_interface = RMQInterface()

            message = {
                "action": "PAYMENT",
                "payment_intent_id": payment_intent.id,
            }
            
            rmq_interface.publish(
                exchange=RMQConfig.EXCHANGE.value,
                routing_key=RMQConfig.PAYMENT_PROCESSOR_ROUTING_KEY.value,
                message=json.dumps(message),
            )
            print("Payment intent published to payment processor")
        except Exception as e:
            print(f"Error publishing payment intent: {e}")
            raise e