"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const ProductModel = use("App/Models/Product");
const makeProductUtil = require("../../util/ProductUtil.func");

class Validator {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request }, next, properties = []) {
    if (properties.find((property) => property === "bid")) {
      const { bid_amount, product_uuid } = request.body;

      const isBiddable = await makeProductUtil(ProductModel).hasBiddableFlag(
        product_uuid
      );

      if (!isBiddable)
        return {
          status: 403,
          error: "Access denied. product is not yet biddable.",
        };

      const existingBids = await makeProductUtil(
        ProductModel
      ).findExistingBidOnThisProduct(product_uuid);

      if (existingBids.length) {
        const sortedBid = existingBids.sort((bid_one, bid_two) => {
          if (bid_two) {
            return bid_two.toJSON().bid_amount - bid_one.toJSON().bid_amount;
          }

          return 0 - bid_one.toJSON().bid_amount;
        });

        const highestBid = sortedBid[0].toJSON().bid_amount;

        const { product_bid_increment } = await makeProductUtil(ProductModel)
          .getById(product_uuid, "productDetail")
          .then((response) => response.getRelated("productDetail").toJSON());

        if (!product_bid_increment)
          return {
            status: 404,
            error:
              "Product not found. product you are looking for does not exist.",
            data: undefined,
          };

        if (bid_amount < highestBid + product_bid_increment)
          return {
            status: 422,
            error:
              "Requirement not met. your bid amount is lower than minimum biddable amount.",
          };
      } else {
        const { product_bid_start } = await makeProductUtil(ProductModel)
          .getById(product_uuid, "productDetail")
          .then((response) => response.getRelated("productDetail").toJSON());

        if (!product_bid_start)
          return {
            status: 404,
            error:
              "Product not found. product you are looking for does not exist.",
            data: undefined,
          };

        if (bid_amount < product_bid_start)
          return {
            status: 422,
            error:
              "Requirement not met. your bid amount is lower than minimum starting point.",
            data: undefined,
          };
      }
    }
    // call next to advance the request
    await next();
  }
}

module.exports = Validator;
