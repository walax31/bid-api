"use strict";

/** @type {import('@adonisjs/framework/src/Server')} */
const Server = use("Server");

/*
|--------------------------------------------------------------------------
| Global Middleware
|--------------------------------------------------------------------------
|
| Global middleware are executed on each http request only when the routes
| match.
|
*/
const globalMiddleware = [
  "Adonis/Middleware/BodyParser",
  "App/Middleware/ConvertEmptyStringsToNull",
];

/*
|--------------------------------------------------------------------------
| Named Middleware
|--------------------------------------------------------------------------
|
| Named middleware is key/value object to conditionally add middleware on
| specific routes or group of routes.
|
| // define
| {
|   auth: 'Adonis/Middleware/Auth'
| }
|
| // use
| Route.get().middleware('auth')
|
*/
const namedMiddleware = {
  auth: "App/Middleware/Auth",
  credential: "App/Middleware/Credential",
  url: "App/Middleware/UrlHandler",
  product: "App/Middleware/ProductImageHandler",
  // logger: "App/Middleware/Logger",
  validator: "App/Middleware/Validator",
  cron: "App/Middleware/CronInitiate",
  file: "App/Middleware/HandleFileUpload",
};

/*
|--------------------------------------------------------------------------
| Server Middleware
|--------------------------------------------------------------------------
|
| Server level middleware are executed even when route for a given URL is
| not registered. Features like `static assets` and `cors` needs better
| control over request lifecycle.
|
*/
const serverMiddleware = [
  // 'Adonis/Middleware/Static',
  "Adonis/Middleware/Cors",
];

Server.registerGlobal(globalMiddleware)
  .registerNamed(namedMiddleware)
  .use(serverMiddleware);
