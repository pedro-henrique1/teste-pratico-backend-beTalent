import vine from '@vinejs/vine'

const email = () => vine.string().email().maxLength(254)
const password = () => vine.string().minLength(8).maxLength(32)

export const signupValidator = vine.create({
  email: email().unique({ table: 'users', column: 'email' }),
  password: password(),
  role: vine.string().in(['ADMIN', 'MANAGER', 'FINANCE', 'USER']).optional(),
})

export const loginValidator = vine.create({
  email: email(),
  password: vine.string(),
})

export const updateUserValidator = vine.create({
  email: email().unique({ table: 'users', column: 'email' }),
  password: password(),
  role: vine.string().in(['ADMIN', 'MANAGER', 'FINANCE', 'USER']).optional(),
})
