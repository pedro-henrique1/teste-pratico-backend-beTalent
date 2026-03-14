import Client from '#models/client'
import ClientTransformer from '#transformers/client_transformer'
import { HttpContext } from '@adonisjs/core/http'

export default class ClientsController {
  async index({ serialize }: HttpContext) {
    const clients = await Client.all()
    return serialize(await ClientTransformer.transform(clients))
  }

  async show({ params, serialize }: HttpContext) {
    const client = await Client.query()
      .where('id', params.id)
      .preload('transactions', (q) => {
        q.orderBy('created_at', 'desc')
      })
      .firstOrFail()

    return serialize(await ClientTransformer.transform(client))
  }
}
