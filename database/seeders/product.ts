import Product from '#models/products'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const products = [
      {
        name: 'Plano Pro - Assinatura Mensal',
        amount: 49.99,
      },
      {
        name: 'Curso Desenvolvimento Web Fullstack',
        amount: 299.99,
      },
      {
        name: 'E-book: Como passar em entrevistas técnicas',
        amount: 19.99,
      },
      {
        name: 'Mentoria Exclusiva (1 hora)',
        amount: 150.0,
      },
      {
        name: 'Ticket Conferência Tech 2026',
        amount: 450.0,
      },
    ]

    for (const prod of products) {
      await Product.updateOrCreate({ name: prod.name }, prod)
    }
  }
}
