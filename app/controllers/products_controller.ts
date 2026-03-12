import Product from '#models/products'
import ProductTransformer from '#transformers/product_transformer'
import { createProductValidator, updateProductValidator } from '#validators/product'
import { HttpContext } from '@adonisjs/core/http'

export default class ProductsController {
  async index({ serialize }: HttpContext) {
    const products = await Product.query().orderBy('name', 'asc')
    return serialize(await ProductTransformer.transform(products))
  }

  async show({ params, serialize }: HttpContext) {
    const products = await Product.findOrFail(params.id)

    return serialize(await ProductTransformer.transform(products))
  }

  async store({ request, serialize }: HttpContext) {
    const payload = await request.validateUsing(createProductValidator)

    const product = await Product.create(payload)
    return serialize(await ProductTransformer.transform(product))
  }

  async update({ params, request, serialize }: HttpContext) {
    const product = await Product.findByOrFail(params.id)

    const payload = await request.validateUsing(updateProductValidator)

    product.merge(payload)
    await product.save()

    return serialize(await ProductTransformer.transform(product))
  }

  async destroy({ params, response }: HttpContext) {
    const product = await Product.findByOrFail(params.id)

    await product.delete()

    return response.status(200).send({
      message: 'Product deleted successfully',
    })
  }
}
