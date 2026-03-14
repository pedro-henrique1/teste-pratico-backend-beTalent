import { PaymentGateway } from '../contracts/payment_gateway.ts'
import Gateway1Adapter from './gateway1_adapter.ts'
import Gateway2Adapter from './gateway2_adapter.ts'

export default class GatewayFactory {
  private static adapters: Record<string, () => PaymentGateway> = {
    'Gateway 1': () => new Gateway1Adapter(),
    'Gateway 2': () => new Gateway2Adapter(),
  }

  public static make(name: string): PaymentGateway {
    const adapterCreator = this.adapters[name]

    if (!adapterCreator) {
      throw new Error(`Gateway adapter for "${name}" not found.`)
    }

    return adapterCreator()
  }
}
