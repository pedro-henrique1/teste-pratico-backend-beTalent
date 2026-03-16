import User from '#models/user'
import UserTransformer from '#transformers/user_transformer'
import { updateUserValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  /**
   * @index
   * @summary Listar todos os usuários
   * @description Retorna uma lista de todos os usuários (Requer Gerente)
   * @paramUse(sortable, filterable)
   */
  async index({ serialize, request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const users = await User.query().orderBy('email', 'asc').paginate(page, limit)
    return response.ok(await serialize(UserTransformer.transform(users)))
  }

  /**
   * @show
   * @summary Obter um usuário
   * @description Retorna os detalhes de um usuário específico por ID (Requer Gerente)
   */
  async show({ params, serialize, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    return response.ok(await serialize(UserTransformer.transform(user)))
  }

  /**
   * @update
   * @summary Atualizar um usuário
   * @description Atualiza as informações e/ou cargo de um usuário existente (Requer Gerente)
   * @requestBody {"email": "...", "password": "...", "role": "..."}
   */
  async update({ params, request, serialize, response }: HttpContext) {
    const user = await User.findOrFail(params.id)

    const payload = await request.validateUsing(updateUserValidator)
    await user.merge(payload)
    await user.save()

    return response.ok(await serialize(UserTransformer.transform(user)))
  }

  /**
   * @destroy
   * @summary Excluir um usuário
   * @description Remove um usuário do sistema (Requer Gerente)
   */
  async destroy({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)

    await user.delete()

    return response.noContent()
  }
}
