from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from payments_db.models import Merchant, Refund
from refund.schemas import CreateRefundRequest, CreateRefundResponse, RefundSchema
from refund.repository import RefundRepository
from config import RefundStatus
from payment.repository import PaymentIntentRepository
from refund.utils import RefundUtils

class RefundService:
    """
    Service class for refunds.
    """
    @staticmethod
    async def initiate_refund(
        request: CreateRefundRequest,
        merchant: Merchant,
        db: AsyncSession,
    ) -> CreateRefundResponse:
        """
        Service to initiate a refund.
        Args:
            refund (Refund): The refund to initiate.
            db (AsyncSession): The database session.
        Returns:
            RefundResponse: The refund response.
        """
        # Check if refund already exists
        row = await RefundRepository.get_by_merchant_id_idempotency_key(
            merchant_id=merchant.id,
            idempotency_key=request.idempotency_key,
            db=db,
        )
        if row is not None and row.merchant_id == merchant.id:
            print("Refund already exists with idempotency key:", request.idempotency_key)
            if row.amount != request.amount or row.payment_intent_id != request.payment_intent_id:
                print("Refund amount or payment intent ID does not match existing refund:", request.idempotency_key)
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Refund amount or payment intent ID does not match",
                )
            
            print("Duplicate refund found, returning existing refund:", row.id)
            return CreateRefundResponse(refund_id=row.id, status=row.status)

        # Get payment intent by ID
        payment_intent = await PaymentIntentRepository.get_by_id(
            payment_intent_id=request.payment_intent_id,
            db=db,
        )
        if payment_intent is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment intent not found")

        if payment_intent.merchant_id != merchant.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Payment intent does not belong to this merchant")

        # TODO: Check if remaining balance is enough for the refund

        refund = Refund(
            merchant_id=payment_intent.merchant_id,
            payment_intent_id=request.payment_intent_id,
            amount=request.amount,
            currency=payment_intent.currency,
            reason=request.reason,
            status=RefundStatus.PENDING.value,
            idempotency_key=request.idempotency_key,
        )

        # Create refund entry
        refund = await RefundRepository.create(refund=refund, db=db)

        # Publish refund to refund processor
        RefundUtils.publish_refund(refund=refund)
        print("Refund initiated:", refund.id)

        return CreateRefundResponse(refund_id=refund.id, status=refund.status)

    @staticmethod
    async def get_for_merchant(
        merchant: Merchant,
        db: AsyncSession,
    ) -> list[RefundSchema]:
        """
        Service to get all refunds for a merchant.
        Args:
            merchant (Merchant): The current merchant.
            db (AsyncSession): The database session.
        Returns:
            list[RefundSchema]: The list of refunds.
        """
        # List refunds by merchant
        refunds = await RefundRepository.list_by_merchant(
            merchant_id=merchant.id,
            db=db,
        )
        print("Refunds listed for merchant:", merchant.id)

        return [
            RefundSchema(
                id=r.id,
                merchant_id=r.merchant_id,
                payment_intent_id=r.payment_intent_id,
                amount=r.amount,
                currency=r.currency,
                status=r.status,
                reason=r.reason,
                created_at=r.created_at,
                updated_at=r.updated_at,
            )
            for r in refunds
        ]