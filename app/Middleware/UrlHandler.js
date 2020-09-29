"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Drive = use("Drive");

const urlProcessor = require("../../service/multiPartFileProcessor");

class UrlHandler {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ response }, next) {
    // call next to advance the request
    await next();

    const { data } = response._lazyBody.content;

    if (data.length) {
      response._lazyBody.content.data = await Promise.all(
        await urlProcessor(Drive, data)
      );
    }

    if (data && typeof data === "Object")
      response._lazyBody.content.data = {
        user_uuid: data.user_uuid,
        first_name: data.first_name,
        last_name: data.last_name,
        path_to_credential: data.path_to_credential
          ? await Drive.disk("s3").getSignedUrl(data.path_to_credential)
          : undefined,
        customer_id: data.customer_id,
        uuid: data.uuid,
        user: data.getRelated("user") || undefined,
        address: data.getRelated("address") || undefined,
      };
  }
}

module.exports = UrlHandler;
