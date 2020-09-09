"use strict";
const Database = use(`Database`);

const ProductDetail = use("App/Models/ProductDetail");
const makeProductUtil = require("../../../util/ProductDetailUtil.func");

function numberTypeParamValidator(number) {
  if (Number.isNaN(parseInt(number))) {
    return {
      error: `param:${number} is not supported,please use number type param intnstead`,
    };
  }
  return {};
}
class ProductDetailController {
  async index({ request }) {
    const { references = undefined } = request.qs;
    const productDetail = await makeProductDetailUtil(ProductDetail).getAll(
      references
    );

    return { status: 200, error: undefined, data: productDetail };
  }

  async show({ request }) {
    const { id } = request.params;
    const { references } = request.qs;

    const validateValue = numberTypeParamValidator(id);
    if (validateValue.error)
      return { status: 500, error: validateValue.error, date: undefined };

    const productDetail = await makeProductDetailUtil(ProductDetail).getAll(
      references
    );
    return { status: 200, error: undefined, data: productDetail || {} };
  }
  async store({ request }) {
    const {
      product_price,
      product_bid_start,
      product_bid_increment,
      product_description,
    } = request.body;

    const rules = {
      product_price: "required",
      product_bid_start: "required",
      product_bid_increment: "required",
      product_description: "required",
    };
    const productDetail = await makeProductDetailUtil(ProductDetail).create(
      {
        product_price,
        product_bid_start,
        product_bid_increment,
        product_description,
      },
      rules
    );
    return {
      status: 200,
      error: undefined,
      data: product_price,
      product_bid_start,
      product_bid_increment,
      product_description,
    };
  }
  async update({ request }) {
    const { body, params } = request;
    const { id } = params;
    const { product_price } = body;
    const { product_bid_start } = body;
    const { product_bid_increment } = body;
    const { product_description } = body;

    const productDetailID = await Database.table("product_details")
      .where({ product_id: id })
      .update({
        product_price,
        product_bid_start,
        product_bid_increment,
        product_description,
      });
    const productDetail = await Database.table("product_details")
      .where({ product_id: productDetailID })
      .first();

    return { status: 200, error: undefined, data: productDetail };
  }
  async destroy({ request }) {
    const { id } = request.params;
    await Database.table("product_details").where({ product_id: id }).delete();

    return { status: 200, error: undefined, data: { massage: "success" } };
  }
}

module.exports = ProductDetailController;
