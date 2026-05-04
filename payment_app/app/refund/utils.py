import json

from interface.rmq_interface import RMQInterface
from payments_db.models import Refund
from config import RMQConfig

class RefundUtils:
    """
    Utility class for payments.
    """

    @staticmethod
    def publish_refund(refund: Refund) -> None:
        """
        Publish a refund to the refund processor.
        Args:
            refund (Refund): The refund to publish.
        """
        try:
            rmq_interface = RMQInterface()

            message = {
                "action": "REFUND",
                "refund_id": refund.id,
            }
            
            rmq_interface.publish(
                exchange=RMQConfig.EXCHANGE.value,
                routing_key=RMQConfig.REFUND_PROCESSOR_ROUTING_KEY.value,
                message=json.dumps(message),
            )
            print("Refund published to refund processor")
        except Exception as e:
            print(f"Error publishing refund: {e}")
            raise e