import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const user = await User.updateOrCreate(
      { email: 'dev@betalent.tech' },
      {
        password: 'FEC9BB078BF338F464F96B48089EB498',
        role: 'ADMIN',
      }
    )
    console.log('Seeded user password in DB:', user.password)
  }
}
