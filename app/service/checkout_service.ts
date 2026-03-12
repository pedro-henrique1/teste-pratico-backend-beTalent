import Client from '#models/client'
import Product from '#models/products'
import Transaction from '#models/transactions'
import db from '@adonisjs/lucid/services/db'
import PaymentService from '../service/payment_service.ts'
import type { CheckoutPayload } from '../types/checkout.ts'

export default class CheckoutService {
  private paymentService = new PaymentService()

  async process(payload: CheckoutPayload) {
    const client = await Client.updateOrCreate(
      { email: payload.client.email },
      { name: payload.client.name, email: payload.client.email }
    )

    const productIds = payload.products.map((p) => p.id)
    const dbProducts = await Product.query().whereIn('id', productIds)

    let totalAmount = 0
    const productsToAttach: Record<number, { quantity: number; unit_price: number }> = {}

    const productMap = new Map(dbProducts.map((p) => [p.id, p]))

    for (const p of payload.products) {
      const product = productMap.get(p.id)

      if (!product) {
        throw new Error(`Product ${p.id} not found`)
      }

      totalAmount += product.amount * p.quantity

      productsToAttach[product.id] = {
        quantity: p.quantity,
        unit_price: product.amount,
      }
    }

    if (totalAmount <= 0) {
      throw new Error('Invalid purchase amount')
    }

    const paymentResponse = await this.paymentService.charge({
      amount: totalAmount,
      name: payload.client.name,
      email: payload.client.email,
      card_number: payload.credit_card.number,
      card_holder_name: payload.credit_card.holder_name,
      exp_month: payload.credit_card.exp_month,
      exp_year: payload.credit_card.exp_year,
      cvv: payload.credit_card.cvv,
    })

    const transaction = await db.transaction(async (trx) => {
      const newTransaction = new Transaction()
      newTransaction.useTransaction(trx)

      newTransaction.clientId = client.id
      newTransaction.gatewayId = paymentResponse.gateway_id
      newTransaction.externalId = paymentResponse.external_id || null
      newTransaction.status = paymentResponse.status
      newTransaction.amount = totalAmount
      newTransaction.cardLastNumbers = payload.credit_card.number.slice(-4)

      if (!paymentResponse.success) {
        throw new Error(paymentResponse.error || 'Payment failed')
      }

      await newTransaction.save()
      await newTransaction.related('products').attach(productsToAttach)

      return newTransaction
    })

    await transaction.load('client')
    await transaction.load('gateway')
    await transaction.load('products')

    return transaction
  }
}
