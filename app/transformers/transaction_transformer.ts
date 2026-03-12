import Transaction from '#models/transactions'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class TransactionTransformer extends BaseTransformer<Transaction> {
  toObject() {
    const data: any = {
      id: this.resource.id,
      external_id: this.resource.externalId,
      status: this.resource.status,
      amount: this.resource.amount,
      card_last_numbers: this.resource.cardLastNumbers,
      createdAt: this.resource.createdAt,
      updatedAt: this.resource.updatedAt,
    }

    if (this.resource.client) {
      data.client = {
        id: this.resource.client.id,
        name: this.resource.client.name,
        email: this.resource.client.email,
      }
    }

    if (this.resource.gateway) {
      data.gateway = {
        id: this.resource.gateway.id,
        name: this.resource.gateway.name,
      }
    }

    if (this.resource.products) {
      data.products = this.resource.products.map((product) => ({
        id: product.id,
        name: product.name,
        quantity: product.$extras.pivot_quantity,
        unit_price: product.$extras.pivot_unit_price,
      }))
    }

    return data
  }
}
