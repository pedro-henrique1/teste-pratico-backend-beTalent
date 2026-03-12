import Gateway from '#models/gateways'
import { gatewayValidator } from '#validators/gateway'
import { HttpContext } from '@adonisjs/core/http'

export default class GatewaysController {
  async index({}: HttpContext) {
    return await Gateway.query().where('is_active', true).orderBy('priority', 'desc')
  }

  async update({ params, request }: HttpContext) {
    const gateway = await Gateway.findOrFail(params.id)

    const payload = await request.validateUsing(gatewayValidator)

    gateway.merge(payload)
    await gateway.save()

    return gateway
  }
}
