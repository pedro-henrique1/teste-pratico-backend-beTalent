import { Exception } from '@adonisjs/core/exceptions'

export default class GatewayError extends Exception {
  constructor(message: string) {
    super(message)
    this.name = 'GatewayError'
    this.status = 500
  }
}
