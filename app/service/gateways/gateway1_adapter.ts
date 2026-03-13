import env from '#start/env'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import { ChargeRequest, GatewayResponse, PaymentGateway } from '../contracts/payment_gateway.ts'

export default class Gateway1Adapter implements PaymentGateway {
  public name = 'Gateway 1'
  private baseUrl = env.get('GATEWAY1_URL')
  private email = env.get('GATEWAY1_EMAIL')
  private authToken = env.get('GATEWAY1_AUTH_TOKEN')

  private safetyMargin = 300
  private defaultTTL = 3600

  private async getJwtToken(): Promise<string> {
    try {
      const response = await axios.post(`${this.baseUrl}/login`, {
        email: this.email,
        token: this.authToken,
      })

      const newToken = response.data.token
      let ttl = this.defaultTTL
      const decoded = jwt.decode(newToken)

      if (decoded && typeof decoded !== 'string' && decoded.exp) {
        const now = Math.floor(Date.now() / 1000)
        ttl = decoded.exp - now - this.safetyMargin
        if (ttl <= 0) ttl = 60
      }

      return newToken
    } catch (error) {
      // Security: Hide internal credentials or URLs in error
      throw new Error('Could not authenticate with Payment Provider 1')
    }
  }

  public async charge(data: ChargeRequest): Promise<GatewayResponse> {
    try {
      const token = await this.getJwtToken()
      const response = await axios.post(
        `${this.baseUrl}/transacoes`,
        {
          amount: data.amount,
          name: data.name,
          email: data.email,
          cardNumber: data.card_number,
          cvv: data.cvv,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000,
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
