import Gateway from '#models/gateways'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class GatewayTransformer extends BaseTransformer<Gateway> {
  toObject() {
    return this.pick(this.resource, ['id', 'name', 'is_active', 'priority'])
  }
}
