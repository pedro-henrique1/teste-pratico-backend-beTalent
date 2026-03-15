import Client from '#models/client'
import ClientTransformer from '#transformers/client_transformer'
import { HttpContext } from '@adonisjs/core/http'

export default class ClientsController {
  async index({ serialize, request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const clients = await Client.query().orderBy('name', 'asc').paginate(page, limit)
    return response.ok(await serialize(ClientTransformer.transform(clients)))
  }

  async show({ params, serialize, request, response }: HttpContext) {
    const limit = request.input('limit', 10)

    const client = await Client.query()
      .where('id', params.id)
      .preload('transactions', (q) => {
        q.orderBy('created_at', 'desc').limit(limit)
      })
      .firstOrFail()

    return response.ok(await serialize(ClientTransformer.transform(client)))
  }
}
