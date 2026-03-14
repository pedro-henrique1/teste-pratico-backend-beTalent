import Product from '#models/products'
import ProductTransformer from '#transformers/product_transformer'
import { createProductValidator, updateProductValidator } from '#validators/product'
import { HttpContext } from '@adonisjs/core/http'

export default class ProductsController {
  async index({ request, serialize }: HttpContext) {
    const page = Number(request.input('page', 1))
    const limit = Number(request.input('limit', 10))

    const products = await Product.query().orderBy('name', 'asc').paginate(page, limit)
    const data = await ProductTransformer.transform(products)

    return serialize(data)
  }

  async show({ params, serialize }: HttpContext) {
    const product = await Product.findOrFail(params.id)

    const data = await ProductTransformer.transform(product)

    return serialize(data)
  }

  async store({ request, response, serialize }: HttpContext) {
    const payload = await request.validateUsing(createProductValidator)
    const product = await Product.create(payload)

    const data = await serialize(ProductTransformer.transform(product))

    return response.created(data)
  }

  async update({ params, request, response, serialize }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    const payload = await request.validateUsing(updateProductValidator)

    product.merge(payload)
    await product.save()

    const data = await serialize(ProductTransformer.transform(product))

    return response.ok(data)
  }

  async destroy({ params, response }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    await product.delete()

    return response.noContent()
  }
}
