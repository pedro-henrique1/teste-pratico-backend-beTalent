import Product from '#models/products'
import ProductTransformer from '#transformers/product_transformer'
import { createProductValidator, updateProductValidator } from '#validators/product'
import { HttpContext } from '@adonisjs/core/http'

export default class ProductsController {
  /**
   * @index
   * @summary Listar todos os produtos
   * @description Retorna uma lista de todos os produtos cadastrados no sistema (Requer Gerente/Financeiro)
   * @paramUse(sortable, filterable)
   */
  async index({ request, serialize }: HttpContext) {
    const page = Number(request.input('page', 1))
    const limit = Number(request.input('limit', 10))

    const products = await Product.query().orderBy('name', 'asc').paginate(page, limit)
    const data = await ProductTransformer.transform(products)

    return serialize(data)
  }

  /**
   * @show
   * @summary Obter um produto
   * @description Retorna as informações de um produto específico pelo ID (Requer Gerente/Financeiro)
   */
  async show({ params, serialize }: HttpContext) {
    const product = await Product.findOrFail(params.id)

    const data = await ProductTransformer.transform(product)

    return serialize(data)
  }

  /**
   * @store
   * @summary Cadastrar um produto
   * @description Cria um novo produto no sistema (Requer Gerente/Financeiro)
   * @requestBody {"name": "...", "amount": 1}
   */
  async store({ request, response, serialize }: HttpContext) {
    const payload = await request.validateUsing(createProductValidator)
    const product = await Product.create(payload)

    const data = await serialize(ProductTransformer.transform(product))

    return response.created(data)
  }

  /**
   * @update
   * @summary Atualizar um produto
   * @description Atualiza as informações (nome ou valor) de um produto existente (Requer Gerente/Financeiro)
   * @requestBody {"name": "...", "amount": 1}
   */
  async update({ params, request, response, serialize }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    const payload = await request.validateUsing(updateProductValidator)

    product.merge(payload)
    await product.save()

    const data = await serialize(ProductTransformer.transform(product))

    return response.ok(data)
  }

  /**
   * @destroy
   * @summary Excluir um produto
   * @description Remove um produto do sistema (Requer Gerente/Financeiro)
   */
  async destroy({ params, response }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    await product.delete()

    return response.noContent()
  }
}
