import GatewayError from '#exceptions/gateway_erro'
import env from '#start/env'
import axios from 'axios'
import { ChargeRequest, GatewayResponse, PaymentGateway } from '../contracts/payment_gateway.ts'

export default class Gateway1Adapter implements PaymentGateway {
  public name = 'Gateway 1'
  private baseUrl = env.get('GATEWAY1_URL')
  private email = env.get('GATEWAY1_EMAIL')
  private authToken = env.get('GATEWAY1_AUTH_TOKEN')

  private async getJwtToken(): Promise<string> {
    try {
      const response = await axios.post(`${this.baseUrl}/login`, {
        email: this.email,
        token: this.authToken,
      })

      return response.data.token
    } catch (error) {
      throw new GatewayError('Could not authenticate with Payment Provider')
    }
  }

  public async charge(data: ChargeRequest): Promise<GatewayResponse> {
    try {
      const token = await this.getJwtToken()
      const response = await axios.post(
        `${this.baseUrl}/transactions`,
        {
          amount: data.amount,
          name: data.name,
          email: data.email,
          cardNumber: data.card_number,
          cvv: data.cvv,
        },
        {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          timeout: 5000,
        }
      )

      return {
        success: true,
        external_id: response.data.id || response.data.external_id,
        status: 'paid',
      }
    } catch (error: any) {
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

  public async refund(externalId: string): Promise<boolean> {
    try {
      const token = await this.getJwtToken()
      await axios.post(
        `${this.baseUrl}/transactions/${externalId}/refund`,
        {},
        {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          timeout: 5000,
        }
      )

      return true
    } catch (error) {
      return false
    }
  }
}
