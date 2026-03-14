/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  accessToken: {
    store: typeof routes['access_token.store']
  }
  newAccount: {
    store: typeof routes['new_account.store']
  }
  transaction: {
    store: typeof routes['transaction.store']
    index: typeof routes['transaction.index']
    show: typeof routes['transaction.show']
  }
  profile: {
    show: typeof routes['profile.show']
  }
  products: {
    index: typeof routes['products.index']
    store: typeof routes['products.store']
    show: typeof routes['products.show']
    update: typeof routes['products.update']
    destroy: typeof routes['products.destroy']
  }
  users: {
    index: typeof routes['users.index']
    show: typeof routes['users.show']
    update: typeof routes['users.update']
    destroy: typeof routes['users.destroy']
  }
  clients: {
    show: typeof routes['clients.show']
    index: typeof routes['clients.index']
  }
  gateways: {
    toggle: typeof routes['gateways.toggle']
    update: typeof routes['gateways.update']
  }
}
