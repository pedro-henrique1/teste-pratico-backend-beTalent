import User from '#models/user'
import UserTransformer from '#transformers/user_transformer'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  async index({ serialize }: HttpContext) {
    const users = await User.query().orderBy('email', 'asc')
    return serialize(UserTransformer.transform(users))
  }

  async show({ params, serialize }: HttpContext) {
    const user = await User.findOrFail(params.id)
    return serialize(UserTransformer.transform(user))
  }

  async update({ params, request, serialize }: HttpContext) {
    const user = await User.findOrFail(params.id)

    const data = request.only(['email', 'password', 'role'])
    await user.merge(data)
    await user.save()

    return serialize(UserTransformer.transform(user))
  }

  async destroy({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)

    await user.delete()

    return response.noContent()
  }
}
