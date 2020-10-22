'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => ({
  greeting: 'Welcome to bid-api.',
  body: 'Our currently available route: /api/v1'
})).middleware('auth:all')

Route.group(() => {
  Route.resource('/bids', 'BidController')
    .validator(new Map([[['store'], ['StoreBid']]]))
    .middleware(new Map([
      [['index'], ['auth:customer,admin', 'credential:strict']],
      [['show'], ['auth:customer,admin', 'credential:strict']],
      [
        ['store'],
        [
          'auth:customer',
          'credential:strict',
          'validator:bid',
          'broadcast:bid'
        ]
      ],
      [['update'], ['auth:admin']],
      [['destroy'], ['auth:admin']]
    ]))

  Route.resource('/users', 'UserController')
    .validator(new Map([[['store'], ['StoreUser']]]))
    .middleware(new Map([
      [['index'], ['auth:admin']],
      [['show'], ['auth:customer,admin']],
      [['store'], ['auth:guest', 'cron:token']],
      [['update'], ['auth:customer,admin']],
      [['destroy'], ['auth:admin']]
    ]))

  Route.post('/login', 'CredentialController.login').middleware([
    'auth:guest',
    'cron:token'
  ])

  Route.post(
    '/authenticate',
    'CredentialController.reAuthenticate'
  ).middleware(['auth:guest', 'cron:token'])

  Route.get('/logout', 'CredentialController.logout').middleware('auth:customer,admin')

  Route.get('/check', 'CredentialController.authenticationCheck').middleware('auth:all')

  Route.get('/validation', 'CredentialController.validationCheck').middleware('auth:all')

  Route.get(
    '/download/:section/:id',
    'ImageController.downloadCredentialImage'
  ).middleware('auth:customer,admin')

  Route.get(
    '/download/:section/:product_uuid/:id',
    'ImageController.downloadProductImage'
  ).middleware('auth:all')

  Route.post('/upload', 'ImageController.uploadCredentialImage')
    .middleware([
      'auth:customer',
      'credential',
      'cron:alert',
      'broadcast:alert'
    ])
    .validator('StoreCredential')

  Route.post(
    '/upload/:product_uuid',
    'ImageController.uploadProductImage'
  ).middleware(['auth:customer', 'credential:strict'])

  Route.resource('/credentialRatings', 'CredentialRatingController')
    .validator(new Map([[['store'], ['StoreCredentialRating']]]))
    .middleware(new Map([
      [['index'], ['auth:customer,admin', 'credantial:strict']],
      [['show'], ['auth:customer,admin', 'credential:strict']],
      [['store'], ['auth:customer']],
      [['update'], ['auth:customer']],
      [['destroy'], ['auth:customer,admin']]
    ]))

  Route.resource('/customers', 'CustomerController')
    .validator(new Map([[['store'], ['StoreCustomer']]]))
    .middleware(new Map([
      [['index'], ['auth:customer,admin', 'credential:strict']],
      [['show'], ['auth:customer,admin', 'credential:strict']],
      [['store'], ['auth:customer']],
      [['update'], ['auth:customer,admin', 'cron:alert', 'broadcast:alert']],
      [['destroy'], ['auth:customer,admin']]
    ]))

  Route.resource('/orders', 'OrderController')
    .validator(new Map([[['store'], ['StoreOrder']]]))
    .middleware(new Map([
      [['index'], ['auth:customer,admin', 'credential:strict']],
      [['show'], ['auth:customer,admin', 'credential:strict']],
      [['store'], ['auth:admin']],
      [['update'], ['auth:admin']],
      [['destroy'], ['auth:admin']]
    ]))

  Route.resource('/payments', 'PaymentController')
    .validator(new Map([[['store'], ['StorePayment']]]))
    .middleware(new Map([
      [['index'], ['auth:customer,admin', 'credential:strict']],
      [['show'], ['auth:customer,admin', 'credential:strict']],
      [['store'], ['auth:customer', 'credential:strict']],
      [['update'], ['auth:admin']],
      [['destroy'], ['auth:admin']]
    ]))

  Route.resource('/products', 'ProductController')
    .validator(new Map([[['store'], ['StoreProduct']]]))
    .middleware(new Map([
      [['index'], ['auth:all']],
      [['show'], ['auth:all']],
      [['store'], ['auth:customer', 'credential:strict']],
      [['update'], ['auth:customer,admin']],
      [['destroy'], ['auth:customer,admin']]
    ]))

  Route.resource('/productDetails', 'ProductDetailController')
    .validator(new Map([[['store'], ['StoreProductDetail']]]))
    .middleware(new Map([
      [['index'], ['auth:all']],
      [['show'], ['auth:all']],
      [['store'], ['auth:customer,admin', 'credential:strict', 'cron:order']],
      [['update'], ['auth:admin']],
      [['destroy'], ['auth:admin']]
    ]))

  Route.resource('/addresses', 'AddressController')
    .validator(new Map([[['store'], ['StoreAddress']]]))
    .middleware(new Map([
      [['index'], ['auth:customer,admin']],
      [['show'], ['auth:customer,admin']],
      [['store'], ['auth:customer']],
      [['update'], ['auth:customer', 'credential:strict']],
      [['destroy'], ['auth:customer', 'credential:strict']]
    ]))

  Route.put('/alerts/read', 'AlertController.bulkRead').middleware([
    'auth:customer,admin',
    'broadcast:alert'
  ])
  Route.patch('/alerts/read', 'AlertController.bulkRead').middleware([
    'auth:customer,admin',
    'broadcast:alert'
  ])

  Route.resource('/alerts', 'AlertController')
    .validator(new Map([[['store'], ['StoreAlert']]]))
    .middleware(new Map([
      [['index'], ['auth:customer,admin']],
      [['show'], ['auth:customer,admin']],
      [['store'], ['auth:customer,admin', 'credential:strict']],
      [['update'], ['auth:customer,admin', 'broadcast:alert']],
      [['destroy'], ['auth:admin']]
    ]))

  Route.resource('/tags', 'TagController')
    .validator(new Map([[['store'], ['StoreTag']]]))
    .middleware(new Map([
      [['index'], ['auth:all']],
      [['show'], ['auth:all']],
      [['store'], ['auth:customer', 'credential:strict']],
      [['update'], ['auth:admin']],
      [['destroy'], ['auth:admin']]
    ]))
}).prefix('api/v1')
