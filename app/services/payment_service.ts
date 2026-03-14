import Gateway from '#models/gateways'
import { ChargeRequest, GatewayResponse } from './contracts/payment_gateway.ts'
import GatewayFactory from './gateways/gateway_factory.ts'

export default class PaymentService {
  public async charge(data: ChargeRequest): Promise<GatewayResponse & { gateway_id: number }> {
    const gateways = await Gateway.query().where('is_active', true).orderBy('priority', 'asc')

    if (gateways.length === 0) {
      throw new Error('No active payment gateways available')
    }

    let lastError: any = null

    for (const gateway of gateways) {
      try {
        const adapter = GatewayFactory.make(gateway.name)
        const response = await adapter.charge(data)

        if (response.success) {
          return {
            ...response,
            gateway_id: gateway.id,
          }
        }

        lastError = response
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        console.error(`Error processing payment with ${gateway.name}:`, message)
        lastError = { success: false, error: message, status: 'error' }
      }
    }

    throw new Error(lastError?.error || 'All payment gateways failed')
  }
}
