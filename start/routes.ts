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

        router.patch('/gateways/:id/toggle', [controllers.Gateways, 'index'])
        router.patch('/gateways/:id/priority', [controllers.Gateways, 'update'])
      })
      .use(middleware.auth())
  })
  .prefix('/api/v1')
