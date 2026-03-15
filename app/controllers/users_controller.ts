import User from '#models/user'
import UserTransformer from '#transformers/user_transformer'
import { updateUserValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  async index({ serialize, request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const users = await User.query().orderBy('email', 'asc').paginate(page, limit)
    return response.ok(await serialize(UserTransformer.transform(users)))
  }

  async show({ params, serialize, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    return response.ok(await serialize(UserTransformer.transform(user)))
  }

  async update({ params, request, serialize, response }: HttpContext) {
    const user = await User.findOrFail(params.id)

    const payload = await request.validateUsing(updateUserValidator)
    await user.merge(payload)
    await user.save()

    return response.ok(await serialize(UserTransformer.transform(user)))
  }

  async destroy({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)

    await user.delete()

    return response.noContent()
  }
}
