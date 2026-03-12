import vine from '@vinejs/vine'

export const checkoutValidator = vine.create({
  client: vine.object({
    name: vine.string().trim().minLength(3).maxLength(255),
    email: vine.string().email().trim().maxLength(255),
  }),

  products: vine
    .array(
      vine.object({
        id: vine.number().exists({ table: 'products', column: 'id' }),
        quantity: vine.number().positive().min(1),
      })
    )
    .minLength(1),

  credit_card: vine.object({
    number: vine.string().creditCard(),
    holder_name: vine.string().trim().minLength(3),
    exp_month: vine.number().min(1).max(12),
    exp_year: vine.number().min(new Date().getFullYear()),
    cvv: vine.string().minLength(3).maxLength(4),
  }),
})
