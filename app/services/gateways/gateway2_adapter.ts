import env from '#start/env'
import axios from 'axios'
import { ChargeRequest, GatewayResponse, PaymentGateway } from '../contracts/payment_gateway.ts'

export default class Gateway2Adapter implements PaymentGateway {
  public name = 'Gateway 2'
  private baseUrl = env.get('GATEWAY2_URL')
  private token = env.get('GATEWAY2_TOKEN')
  private secret = env.get('GATEWAY2_SECRET')

  public async charge(data: ChargeRequest): Promise<GatewayResponse> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/transactions`,
        {
          valor: data.amount,
          nome: data.name,
          email: data.email,
          numeroCartao: data.card_number,
          cvv: data.cvv,
        },
        {
          headers: {
            'Gateway-Auth-Token': this.token,
            'Gateway-Auth-Secret': this.secret,
          },
        }
      )

      return {
        success: true,
        external_id: response.data.id || response.data.external_id,
        status: 'paid',
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
      }

      let friendlyError = 'Payment failed during processing'
      if (axios.isAxiosError(error) && error.response?.status === 402) {
        friendlyError = 'Card declined by the issuer'
      }

      return {
        success: false,
        error: friendlyError,
        status: 'error',
      }
    }
  }
}
