import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RoleMiddleware {
  async handle(ctx: HttpContext, next: NextFn, allowedRoles: string[]) {
    const user = ctx.auth.user

    if (!user) {
      return ctx.response.unauthorized({ error: 'User is not authenticated' })
    }

    if (user.role === 'ADMIN') {
      return next()
    }

    if (!allowedRoles.includes(user.role)) {
      return ctx.response.forbidden({
        error: `Acesso negado. Sua permissão é insuficiente para este recurso.`,
      })
    }

    return next()
  }
}
