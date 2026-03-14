import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

router.get('/', () => {
  return { hello: 'world' }
})

router
  .group(() => {
    /*
  |--------------------------------------------------------------------------
  | Public routes
  |--------------------------------------------------------------------------
  */

    router.post('/auth/login', [controllers.AccessToken, 'store'])
    router.post('/auth/signup', [controllers.NewAccount, 'store'])

    router.post('/transactions', [controllers.Transaction, 'store'])

    /*
  |--------------------------------------------------------------------------
  | Private routes
  |--------------------------------------------------------------------------
  */

    router
      .group(() => {
        router.get('/account/profile', [controllers.Profile, 'show'])

        router.resource('products', controllers.Products).apiOnly()

        router.get('/transactions', [controllers.Transaction, 'index'])
        router.get('/transactions/:id', [controllers.Transaction, 'show'])

        // USERS: VER TODOS OS USUÁRIOS E VER UM USUÁRIO ESPECÍFICO
        router.get('/users', [controllers.Users, 'index'])
        router.get('/users/:id', [controllers.Users, 'show'])
        router.put('/users/:id', [controllers.Users, 'update'])
        router.delete('/users/:id', [controllers.Users, 'destroy'])

        // CLIENTES: VER TRANSAÇÕES DO CLIENTE ESPECIFICO E TODOS OS CLIENTES
        router.get('/clients/:id', [controllers.Clients, 'show'])
        router.get('/clients', [controllers.Clients, 'index'])

        // GATEWAYS: ATIVAR/DESATIVAR E PRIORIDADE
        router.patch('/gateways/:id/toggle', [controllers.Gateways, 'toggle'])
        router.patch('/gateways/:id/priority', [controllers.Gateways, 'update'])
      })
      .use(middleware.auth())
  })
  .prefix('/api/v1')
