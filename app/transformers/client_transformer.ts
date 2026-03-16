import type Client from '#models/client'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class ClientTransformer extends BaseTransformer<Client> {
  toObject() {
    const data: any = {
      id: this.resource.id,
      email: this.resource.email,
      createdAt: this.resource.createdAt,
      updatedAt: this.resource.updatedAt,
    }

    if (this.resource.transactions) {
      data.transactions = this.resource.transactions.map((t) => ({
        id: t.id,
        external_id: t.externalId,
        status: t.status,
        amount: t.amount,
        createdAt: t.createdAt,
      }))
    }

    return data
  }
}
