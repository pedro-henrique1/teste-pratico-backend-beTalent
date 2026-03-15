import User from '#models/user'
import UserTransformer from '#transformers/user_transformer'
import { loginValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import JwtService from '../services/jwt_service.ts'

export default class AccessTokenController {
  async store({ request, serialize }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    const token = JwtService.generate(user)

    return serialize({
      user: UserTransformer.transform(user),
      token: token,
    })
  }

  async destroy({ response }: HttpContext) {
    return response.ok({
      message: 'Logged out successfully',
    })
  }
}
