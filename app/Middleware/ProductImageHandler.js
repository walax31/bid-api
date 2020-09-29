"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Drive = use("Drive");

const productImageProcessor = require("../../service/productImageUrlProcessor");

class ProductImageHandler {
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
        await productImageProcessor(Drive, data)
      );
    }

    if (data && typeof data === "Object")
      response._lazyBody.content.data = {
        uuid: data.uuid,
        product_name: data.product_name,
        end_date: data.end_date,
        stock: data.stock,
        is_biddable: data.is_biddable,
        product_image: data.product_image
          ? await Drive.disk("s3").getSignedUrl(data.product_image)
          : undefined,
        customer_uuid: data.customer_uuid,
        customer: data.getRelated("customer") || undefined,
        productDetail: data.getRelated("productDetail") || undefined,
        bids: data.getRelated("bids") || undefined,
        order: data.getRelated("order") || undefined,
        credentialRating: data.getRelated("credentialRating") || undefined,
      };
  }
}

module.exports = ProductImageHandler;
