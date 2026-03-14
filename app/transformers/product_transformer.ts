import Product from '#models/products'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class ProductTransformer extends BaseTransformer<Product> {
  toObject() {
    return {
      id: this.resource.id,
      name: this.resource.name,
      price: Number(this.resource.amount),
      createdAt: this.resource.createdAt,
      updatedAt: this.resource.updatedAt,
    }
  }
}
