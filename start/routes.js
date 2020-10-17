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
    .validator(new Map([[['/bids.store'], ['StoreBid']]]))
    .middleware(new Map([
      [['/bids.index'], ['auth:customer,admin', 'credential:strict']],
      [['/bids.show'], ['auth:customer,admin', 'credential:strict']],
      [
        ['/bids.store'],
        [
          'auth:customer',
          'credential:strict',
          'validator:bid',
          'broadcast:bid'
        ]
      ],
      [['/bids.update'], ['auth:admin']],
      [['/bids.destroy'], ['auth:admin']]
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

  Route.post('/authenticate', 'CredentialController.reAuthenticate').middleware(
    'auth:guest',
    'cron:token'
  )

  Route.post('/validate', 'CredentialController.validate')

  Route.post('/logout', 'CredentialController.logout').middleware('auth:customer,admin')

  Route.get(
    '/download/:section/:id',
    'ImageController.downloadCredentialImage'
  ).middleware('auth:customer,admin')

  Route.get(
    '/download/:section/:product_uuid/:id',
    'ImageController.downloadProductImage'
  ).middleware('auth:all')

  Route.post('/upload', 'ImageController.uploadCredentialImage')
    .middleware('auth:customer', 'credential')
    .validator('StoreCredential')

  Route.post(
    '/upload/:product_uuid',
    'ImageController.uploadProductImage'
  ).middleware('auth:customer', 'credential:strict')

  Route.resource('/credentialRatings', 'CredentialRatingController')
    .validator(new Map([[['/credentialRatings.store'], ['StoreCredentialRating']]]))
    .middleware(new Map([
      [
        ['/credentialRatings.index'],
        ['auth:customer,admin', 'credantial:strict']
      ],
      [
        ['/credentialRatings.show'],
        ['auth:customer,admin', 'credential:strict']
      ],
      [['/credentialRatings.store'], ['auth:customer']],
      [['/credentialRatings.update'], ['auth:customer']],
      [['/credentialRatings.destroy'], ['auth:customer,admin']]
    ]))

  Route.resource('/customers', 'CustomerController')
    .validator(new Map([[['/customers.store'], ['StoreCustomer']]]))
    .middleware(new Map([
      [['/customers.index'], ['auth:customer,admin', 'credential:strict']],
      [['/customers.show'], ['auth:customer,admin', 'credential:strict']],
      [['/customers.store'], ['auth:customer']],
      [['/customers.update'], ['auth:customer,admin', 'broadcast:alert']],
      [['/customers.destroy'], ['auth:customer,admin']]
    ]))

  Route.resource('/orders', 'OrderController')
    .validator(new Map([[['/orders.store'], ['StoreOrder']]]))
    .middleware(new Map([
      [['/orders.index'], ['auth:customer,admin', 'credential:strict']],
      [['/orders.show'], ['auth:customer,admin', 'credential:strict']],
      [['/orders.store'], ['auth:admin']],
      [['/orders.update'], ['auth:admin']],
      [['/orders.destroy'], ['auth:admin']]
    ]))

  Route.resource('/payments', 'PaymentController')
    .validator(new Map([[['/payments.store'], ['StorePayment']]]))
    .middleware(new Map([
      [['/payments.index'], ['auth:customer,admin', 'credential:strict']],
      [['/payments.show'], ['auth:customer,admin', 'credential:strict']],
      [['/payments.store'], ['auth:customer', 'credential:strict']],
      [['/payments.update'], ['auth:admin']],
      [['/payments.destroy'], ['auth:admin']]
    ]))

  Route.resource('/products', 'ProductController')
    .validator(new Map([[['/products.store'], ['StoreProduct']]]))
    .middleware(new Map([
      [['/products.index'], ['auth:all', 'product']],
      [['/products.show'], ['auth:all', 'product']],
      [['/products.store'], ['auth:customer', 'credential:strict']],
      [['/products.update'], ['auth:customer,admin']],
      [['/products.destroy'], ['auth:customer,admin']]
    ]))

  Route.resource('/productDetails', 'ProductDetailController')
    .validator(new Map([[['/productDetails.store'], ['StoreProductDetail']]]))
    .middleware(new Map([
      [['/productDetails.index'], ['auth:all']],
      [['/productDetails.show'], ['auth:all']],
      [
        ['/productDetails.store'],
        ['auth:customer,admin', 'credential:strict', 'cron:order']
      ],
      [['/productDetails.update'], ['auth:admin']],
      [['/productDetails.destroy'], ['auth:admin']]
    ]))

  Route.resource('/addresses', 'AddressController')
    .validator(new Map([[['/addresses.store'], ['StoreAddress']]]))
    .middleware(new Map([
      [['/addresses.index'], ['auth:customer,admin']],
      [['/addresses.show'], ['auth:customer,admin']],
      [['/addresses.store'], ['auth:customer']],
      [['/addresses.update'], ['auth:customer', 'credential:strict']],
      [['/addresses.destroy'], ['auth:customer', 'credential:strict']]
    ]))

  Route.resource('/alerts', 'AlertController')
    .validator(new Map([[['/alerts.store'], ['StoreAlert']]]))
    .middleware(new Map([
      [['/alerts.index'], ['auth:customer,admin']],
      [['/alerts.show'], ['auth:customer,admin']],
      [['/alerts.store'], ['auth:customer,admin', 'credential:strict']],
      [['/alerts.update'], ['auth:customer,admin']],
      [['/alerts.destroy'], ['auth:admin']]
    ]))

  Route.resource('/tags', 'TagController')
    .validator(new Map([[['/tags.store'], ['StoreTag']]]))
    .middleware(new Map([
      [['/tags.index'], ['auth:all']],
      [['/tags.show'], ['auth:all']],
      [['/tags.store'], ['auth:customer', 'credential:strict']],
      [['/tags.update'], ['auth:admin']],
      [['/tags.destroy'], ['auth:admin']]
    ]))
}).prefix('api/v1')
