import Gateway from '#models/gateways'

export default class GatewayTransformer {
  transform(gateway: Gateway) {
    return {
      id: gateway.id,
      name: gateway.name,
      isActive: gateway.is_active,
      priority: gateway.priority,
    }
  }
}
