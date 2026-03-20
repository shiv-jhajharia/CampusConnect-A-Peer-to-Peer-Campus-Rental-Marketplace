from app.repositories.payment_repo import PaymentRepository

class PaymentService:

    @staticmethod
    async def create_payment(data):
        return await PaymentRepository.create_payment(data)

    @staticmethod
    async def mark_success(payment_id):
        await PaymentRepository.update_status(payment_id, "success")

    @staticmethod
    async def mark_failed(payment_id):
        await PaymentRepository.update_status(payment_id, "failed")