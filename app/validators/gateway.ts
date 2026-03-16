import vine from '@vinejs/vine'

export const gatewayValidator = vine.create({
  is_active: vine.boolean().optional(),
})
