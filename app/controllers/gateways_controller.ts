import Gateway from '#models/gateways'
import { gatewayValidator } from '#validators/gateway'
import { HttpContext } from '@adonisjs/core/http'

export default class GatewaysController {
  /**
   * @update
   * @summary Atualizar a prioridade do Gateway
   * @description Altera a ordem de prioridade na qual o gateway é tentado para o pagamento (Requer Admin)
   * @requestBody {"priority": 1}
   */
  async update({ params, request, response }: HttpContext) {
    const gateway = await Gateway.findOrFail(params.id)

    const payload = await request.validateUsing(gatewayValidator)

    gateway.merge(payload)
    await gateway.save()

    return response.noContent()
  }

  /**
   * @toggle
   * @summary Ativar ou desativar o Gateway
   * @description Alterna o status do gateway (Ativo/Inativo) para o processamento de transações (Requer Admin)
   */
  async toggle({ params, response }: HttpContext) {
    const gateway = await Gateway.findOrFail(params.id)

    gateway.merge({
      is_active: !gateway.is_active,
    })
    await gateway.save()

    return response.noContent()
  }
}
