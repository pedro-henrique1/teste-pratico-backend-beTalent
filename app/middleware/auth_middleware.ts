import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import JwtService from '../services/jwt_service.js'
import '../types/http_context.ts'

export default class AuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const authHeader = ctx.request.header('authorization')

    if (!authHeader?.startsWith('Bearer ')) {
      return ctx.response.unauthorized({
        error: 'Token de autenticação ausente ou inválido.',
      })
    }

    const token = authHeader.replace('Bearer ', '')
    const payload = JwtService.verify(token)

    if (!payload?.id) {
      return ctx.response.unauthorized({
        error: 'Token inválido ou expirado.',
      })
    }

    const user = await User.find(payload.id)

    if (!user) {
      return ctx.response.unauthorized({
        error: 'Usuário não encontrado.',
      })
    }

    ctx.user = user

    await next()
  }
}
