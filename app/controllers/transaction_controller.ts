import Transaction from '#models/transactions'
import TransactionTransformer from '#transformers/transaction_transformer'
import { checkoutValidator } from '#validators/transaction'
import { HttpContext } from '@adonisjs/core/http'
import CheckoutService from '../services/checkout_service.ts'

export default class TransactionsController {
  private checkoutService = new CheckoutService()

  /**
   * Process a new checkout/transaction
   */
  async store({ request, serialize }: HttpContext) {
    const payload = await request.validateUsing(checkoutValidator)

    try {
      const transaction = await this.checkoutService.process(payload)
      return serialize(TransactionTransformer.transform(transaction))
    } catch (error) {
      return {
        error: error.message,
      }
    }
  }

  /**
   * List transactions
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
   * Show transaction details
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
}
