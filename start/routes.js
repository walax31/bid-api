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
  return {
    greeting: "Welcome to bid-api.",
    body: "Our currently aviable route: /api/v1",
  };
});

Route.group(() => {
  //api rount start here na ka
  Route.resource("/bids", "BidController");

  Route.resource("/users", "UserController");
  Route.post("/login", "CredentialController.login").middleware("guest");
  Route.post("/authenticate", "CredentialController.reAuthenticate");
  Route.post("/validate", "CredentialController.validate");
  Route.post("/logout", "CredentialController.logout");
  Route.get("/job", "CredentialController.job");
  Route.post("/upload", "CredentialController.upload");
  Route.get("/download", "CredentialController.download");

  Route.resource("/credentialRatings", "CredentialRatingController");

  Route.resource("/customers", "CustomerController").middleware(
    new Map([
      [["/customers.index"], ["url"]],
      [["/customers.show"], ["url"]],
    ])
  );
  // .validator(new Map([[["/customers.update"], ["StoreCredential"]]]));

  Route.resource("/orders", "OrderController");

  Route.resource("/orderDetails", "OrderDetailController");

  Route.resource("/payments", "PaymentController");

  Route.resource("/products", "ProductController").middleware(
    new Map([
      [["/products.index"], ["product"]],
      [["/products.show"], ["product"]],
    ])
  );

  Route.resource("/productDetails", "ProductDetailController");
}).prefix("api/v1");
