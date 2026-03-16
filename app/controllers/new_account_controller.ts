import User from '#models/user'
import JwtService from '#services/jwt_service'
import UserTransformer from '#transformers/user_transformer'
import { signupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class NewAccountController {
  /**
   * @signup
   * @summary Cadastrar novo usuário na plataforma
   * @description Cria uma conta de usuário
   * @requestBody {"email": "...", "password": "...", "role": "..."}
   * @responseBody 200 - {"user": {"email": "...", "role": "...", "firstName": "...", "lastName": "..."}, "token": "..."}
   */
  async store({ request, serialize }: HttpContext) {
    const { email, password, role } = await request.validateUsing(signupValidator)

    const user = await User.create({ email, password, role })
    const token = JwtService.generate(user)

    return serialize({
      user: UserTransformer.transform(user),
      token: token,
    })
  }
}
