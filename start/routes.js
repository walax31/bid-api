"use strict";

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
const Route = use("Route");

Route.get("/", () => {
  return { greeting: "Hello world in JSON" };
});
Route.group(() => {
  //api rount start here na ka
  Route.resource("/bids", "BidController");

  Route.resource("/credentials", "CredentialController");

  Route.resource("/customers", "CustomerController");

  Route.resource("/orders", "OrderController");

  Route.resource("/ordersDetail", "OrderDetailController");

  Route.resource('/payments','PaymentController')

  Route.resource('/products','ProductDetailController')

  Route.resource('/productsDetail','ProductDetailController')
}).prefix("api/v1");
