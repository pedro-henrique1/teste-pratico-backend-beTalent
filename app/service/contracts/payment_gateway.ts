export interface ChargeRequest {
  amount: number // in cents
  name: string
  email: string
  card_number: string
  card_holder_name: string
  exp_month: number
  exp_year: number
  cvv: string
}

export interface GatewayResponse {
  success: boolean
  external_id?: string
  error?: string
  status: 'paid' | 'pending' | 'refused' | 'error' | 'refunded'
}

export interface PaymentGateway {
  name: string
  charge(data: ChargeRequest): Promise<GatewayResponse>
}
