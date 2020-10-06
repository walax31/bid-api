"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const makeCustomerUtil = require("../../util/CustomerUtil.func");
const CustomerModel = use("App/Models/Customer");

class Credential {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request, response }, next, properties = []) {
    if (request.customer_uuid)
      request.is_validated = await makeCustomerUtil(CustomerModel)
        .hasCredentialValidated(request.customer_uuid)
        .then((response) => (response ? true : false));

    if (request.role === "customer") {
      if (properties.find((prop) => prop === "strict") && !request.is_validated)
        response.send({
          status: 404,
          error: "Access denied. invalid credential.",
          data: undefined,
        });
    }

    // call next to advance the request
    await next();
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async wsHandle({ request }, next) {
    // call next to advance the request
    await next();
  }
}

module.exports = Credential;
