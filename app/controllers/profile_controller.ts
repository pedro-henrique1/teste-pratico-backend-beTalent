import UserTransformer from '#transformers/user_transformer'
import type { HttpContext } from '@adonisjs/core/http'
import '../types/http_context.ts'

export default class ProfileController {
  /**
   * @show
   * @description Retorna o perfil do usuário logado no momento
   */
  async show(ctx: HttpContext) {
    const user = ctx.user || ctx.auth.getUserOrFail()
    return ctx.serialize(UserTransformer.transform(user))
  }
}
