import User from '#models/user'
import UserTransformer from '#transformers/user_transformer'
import { loginValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import JwtService from '../services/jwt_service.ts'

export default class AccessTokenController {
  /**
   * @login
   * @summary Fazer login na conta
   * @description Autentica o usuário na plataforma e retorna o token JWT de acesso
   * @requestBody {"email": "...", "password": "..."}
   * @responseBody 200 - {"user": {"email": "...", "role": "...", "firstName": "...", "lastName": "..."}, "token": "..."}
   */
  async store({ request, serialize }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    const token = JwtService.generate(user)

    return serialize({
      user: UserTransformer.transform(user),
      token: token,
    })
  }

  /**
   * @logout
   * @summary Sair da conta (Logout)
   * @description Expira a sessão atual do usuário
   * @responseBody 200 - {"message": "Logged out successfully"}
   */
  async destroy({ response }: HttpContext) {
    return response.ok({
      message: 'Logged out successfully',
    })
  }
}
