import Transaction from '#models/transactions'
import TransactionTransformer from '#transformers/transaction_transformer'
import { checkoutValidator } from '#validators/transaction'
import { HttpContext } from '@adonisjs/core/http'
import { TransactionStatus } from '../enums/transaction_enum.ts'
import CheckoutService from '../services/checkout_service.ts'
import PaymentService from '../services/payment_service.ts'

export default class TransactionsController {
  private checkoutService = new CheckoutService()
  private paymentService = new PaymentService()

  /**
   * @store
   * @summary Realizar uma compra informando o produto
   * @description Processa uma nova transação (pagamento)
   * @requestBody {"client_id": "...", "gateway_id": "...", "products": ["..."]}
   */
  async store({ request, serialize, response }: HttpContext) {
    const payload = await request.validateUsing(checkoutValidator)

    try {
      const transaction = await this.checkoutService.process(payload)
      return serialize(TransactionTransformer.transform(transaction))
    } catch (error) {
      return response.badGateway({
        error: error.message,
      })
    }
  }

  /**
   * @index
   * @summary Listar todas as transações
   * @description Retorna uma lista de todas as transações (Requer Gerente/Financeiro)
   * @paramUse(sortable, filterable)
   */
  async index({ request, serialize }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const transactions = await Transaction.query()
      .preload('client')
      .preload('gateway')
      .preload('products')
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)

    return serialize(await TransactionTransformer.transform(transactions))
  }

  /**
   * @show
   * @summary Obter uma transação
   * @description Retorna uma transação específica por ID (Requer Gerente/Financeiro)
   */
  async show({ params, serialize }: HttpContext) {
    const transaction = await Transaction.query()
      .where('id', params.id)
      .preload('client')
      .preload('gateway')
      .preload('products')
      .firstOrFail()

    return serialize(await TransactionTransformer.transform(transaction))
  }

  /**
   * @refund
   * @summary Estornar uma transação
   * @description Realiza o estorno de uma transação específica junto ao gateway de pagamento (Requer Gerente/Financeiro)
   */
  async refund({ params, response }: HttpContext) {
    const transaction = await Transaction.findOrFail(params.id)

    if (transaction.status === TransactionStatus.REFUNDED) {
      return response.badRequest({ error: 'Transaction already refunded' })
    }

    if (transaction.status !== TransactionStatus.PAID) {
      return response.badRequest({ error: 'Only paid transactions can be refunded' })
    }

    try {
      const success = await this.paymentService.refund(transaction)

      if (!success) {
        return response.badGateway({ error: 'Gateway refund failed' })
      }

      transaction.status = TransactionStatus.REFUNDED
      await transaction.save()

      return response.noContent()
    } catch (error) {
      return response.badGateway({ error: error.message })
    }
  }
}
