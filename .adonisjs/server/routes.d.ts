import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'access_token.store': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'transaction.store': { paramsTuple?: []; params?: {} }
    'profile.show': { paramsTuple?: []; params?: {} }
    'products.index': { paramsTuple?: []; params?: {} }
    'products.store': { paramsTuple?: []; params?: {} }
    'products.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'products.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'products.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'transaction.index': { paramsTuple?: []; params?: {} }
    'transaction.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'gateways.index': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'gateways.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'profile.show': { paramsTuple?: []; params?: {} }
    'products.index': { paramsTuple?: []; params?: {} }
    'products.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'transaction.index': { paramsTuple?: []; params?: {} }
    'transaction.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'profile.show': { paramsTuple?: []; params?: {} }
    'products.index': { paramsTuple?: []; params?: {} }
    'products.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'transaction.index': { paramsTuple?: []; params?: {} }
    'transaction.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'access_token.store': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'transaction.store': { paramsTuple?: []; params?: {} }
    'products.store': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'products.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'products.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'gateways.index': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'gateways.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'products.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}