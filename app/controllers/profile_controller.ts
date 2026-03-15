import UserTransformer from '#transformers/user_transformer'
import type { HttpContext } from '@adonisjs/core/http'
import '../types/http_context.ts'

export default class ProfileController {
  async show(ctx: HttpContext) {
    const user = ctx.user || ctx.auth.getUserOrFail()
    return ctx.serialize(UserTransformer.transform(user))
  }
}
