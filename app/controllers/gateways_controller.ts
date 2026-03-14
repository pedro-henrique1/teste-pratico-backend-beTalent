import Gateway from '#models/gateways'
import GatewayTransformer from '#transformers/gateway_transformer'
import { gatewayValidator } from '#validators/gateway'
import { HttpContext } from '@adonisjs/core/http'

export default class GatewaysController {
  async update({ params, request, response, serialize }: HttpContext) {
    const gateway = await Gateway.findOrFail(params.id)

    const payload = await request.validateUsing(gatewayValidator)

    gateway.merge(payload)
    await gateway.save()

    const data = serialize(await GatewayTransformer.transform(gateway))

    return response.ok(data)
  }

  async toggle({ params, response, serialize }: HttpContext) {
    const gateway = await Gateway.findOrFail(params.id)

    gateway.merge({
      is_active: !gateway.is_active,
    })
    await gateway.save()

    const data = serialize(await GatewayTransformer.transform(gateway))

    return response.ok(data)
  }
}
