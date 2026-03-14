import Gateway from '#models/gateways'
import { gatewayValidator } from '#validators/gateway'
import { HttpContext } from '@adonisjs/core/http'

export default class GatewaysController {
  async update({ params, request }: HttpContext) {
    const gateway = await Gateway.findOrFail(params.id)

    const payload = await request.validateUsing(gatewayValidator)

    gateway.merge(payload)
    await gateway.save()

    return gateway
  }

  async toggle({ params }: HttpContext) {
    const gateway = await Gateway.findOrFail(params.id)

    gateway.is_active = !gateway.is_active
    await gateway.save()

    return gateway
  }
}
