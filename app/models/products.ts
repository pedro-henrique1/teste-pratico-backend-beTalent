import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Transaction from './transactions.ts'

export default class Product extends BaseModel {
  static table = 'products'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare amount: number

  @column()
  declare name: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => Transaction, {
    pivotTable: 'transaction_products',
    pivotColumns: ['quantity', 'unit_price'],
  })
  declare transactions: ManyToMany<typeof Transaction>
}
