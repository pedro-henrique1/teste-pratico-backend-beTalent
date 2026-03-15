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

        router
          .resource('products', controllers.Products)
          .apiOnly()
          .use('*', middleware.role(['MANAGER', 'FINANCE']))

        router
          .get('/transactions', [controllers.Transaction, 'index'])
          .use(middleware.role(['MANAGER', 'FINANCE']))
        router
          .get('/transactions/:id', [controllers.Transaction, 'show'])
          .use(middleware.role(['MANAGER', 'FINANCE']))

        // USERS: VER TODOS OS USUÁRIOS E VER UM USUÁRIO ESPECÍFICO
        router
          .group(() => {
            router.get('/users', [controllers.Users, 'index'])
            router.get('/users/:id', [controllers.Users, 'show'])
            router.put('/users/:id', [controllers.Users, 'update'])
            router.delete('/users/:id', [controllers.Users, 'destroy'])
          })
          .use(middleware.role(['MANAGER']))

        // CLIENTES: VER TODOS OS CLIENTES E VER UM CLIENTE ESPECÍFICO
        router.get('/clients/:id', [controllers.Clients, 'show']).use(middleware.role(['MANAGER']))
        router.get('/clients', [controllers.Clients, 'index']).use(middleware.role(['MANAGER']))

        // GATEWAYS: ATIVAR/MUDAR PRIORIDADE
        router
          .group(() => {
            router.patch('/gateways/:id/toggle', [controllers.Gateways, 'toggle'])
            router.patch('/gateways/:id/priority', [controllers.Gateways, 'update'])
          })
          .use(middleware.role(['ADMIN']))
      })
      .use(middleware.auth())
  })
  .prefix('/api/v1')
