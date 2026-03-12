export interface CheckoutPayload {
  client: {
    name: string
    email: string
  }
  products: {
    id: number
    quantity: number
  }[]
  credit_card: {
    number: string
    holder_name: string
    exp_month: number
    exp_year: number
    cvv: string
  }
}
