import User from '#models/user'
import UserTransformer from '#transformers/user_transformer'
import { signupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class NewAccountController {
  async store({ request, serialize }: HttpContext) {
    const { email, password, role } = await request.validateUsing(signupValidator)

    const user = await User.create({ email, password, role })
    const token = await User.accessTokens.create(user)

    return serialize({
      user: UserTransformer.transform(user),
      token: token.value!.release(),
    })
  }
}
