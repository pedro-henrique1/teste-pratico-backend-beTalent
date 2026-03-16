import { BaseModel, belongsTo, column, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Client from './client.ts'
import Gateway from './gateways.ts'
import Product from './products.ts'

export default class Transaction extends BaseModel {
  static table = 'transactions'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare clientId: number

  @column()
  declare gatewayId: number | null

  @column()
  declare externalId: string | null

  @column()
  declare status: string

  @column()
  declare amount: number

  @column()
  declare cardLastNumbers: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Client)
  declare client: BelongsTo<typeof Client>

  @belongsTo(() => Gateway)
  declare gateway: BelongsTo<typeof Gateway>

  @manyToMany(() => Product, {
    pivotTable: 'transaction_products',
    pivotColumns: ['quantity', 'product_id'],
  })
  declare products: ManyToMany<typeof Product>
}
