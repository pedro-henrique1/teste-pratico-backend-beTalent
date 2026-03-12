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
  gateways: {
    index: typeof routes['gateways.index']
    update: typeof routes['gateways.update']
  }
}
