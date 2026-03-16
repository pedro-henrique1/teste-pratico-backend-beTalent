import Gateway from '#models/gateways'
import Transaction from '#models/transactions'
import logger from '@adonisjs/core/services/logger'
import { ChargeRequest, GatewayResponse } from './contracts/payment_gateway.ts'
import GatewayFactory from './gateways/gateway_factory.ts'

export default class PaymentService {
  public async charge(data: ChargeRequest): Promise<GatewayResponse & { gateway_id: number }> {
    const gateways = await Gateway.query()
      .where('is_active', true)
      .orderBy('priority', 'asc')
      .orderBy('id', 'asc')

    if (gateways.length === 0) {
      throw new Error('No active payment gateways available')
    }

    let lastError: GatewayResponse | null = null

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
        logger.error({ gateway: gateway.name, error: message }, 'Payment gateway error')
        lastError = { success: false, error: message, status: 'error' }
      }
    }

    return {
      success: false,
      error: lastError?.error || 'All payment gateways failed',
      status: lastError?.status || 'error',
      gateway_id: gateways[gateways.length - 1].id,
    }
  }

  public async refund(transaction: Transaction): Promise<boolean> {
    if (!transaction.gatewayId || !transaction.externalId) {
      throw new Error('Transaction cannot be refunded: gateway data missing')
    }

    await transaction.load('gateway')
    const adapter = GatewayFactory.make(transaction.gateway.name)

    return adapter.refund(transaction.externalId)
  }
}
