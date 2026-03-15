import Product from '#models/products'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Product.createMany([
      {
        name: 'Plano Pro - Assinatura Mensal',
        amount: 49.9,
      },
      {
        name: 'Curso Desenvolvimento Web Fullstack',
        amount: 299.9,
      },
      {
        name: 'E-book: Como passar em entrevistas técnicas',
        amount: 19.9,
      },
      {
        name: 'Mentoria Exclusiva (1 hora)',
        amount: 150.0,
      },
      {
        name: 'Ticket Conferência Tech 2026',
        amount: 450.0,
      },
    ])
  }
}
