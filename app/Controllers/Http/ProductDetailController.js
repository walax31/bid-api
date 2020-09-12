"use strict";

const productDetailValidator = require("../../../service/productDetailValidator");
const ProductDetail = use("App/Models/ProductDetail");
const User = use("App/Models/User");
const Customer = use("App/Models/Customer");
const makeProductDetailUtil = require("../../../util/ProductDetailUtil.func");
const numberTypeParamValidator = require("../../../util/numberTypeParamValidator.func");
const performAuthentication = require("../../../util/authenticate.func");

class ProductDetailController {
  async index({ request }) {
    const { references } = request.qs;

    const productDetails = await makeProductDetailUtil(ProductDetail).getAll(
      references
    );

    return { status: 200, error: undefined, data: productDetails };
  }

  async show({ request }) {
    const { params, qs } = request;

    const { id } = params;

    const { references } = qs;

    const validateValue = numberTypeParamValidator(id);

    if (validateValue.error)
      return { status: 500, error: validateValue.error, date: undefined };

    const productDetail = await makeProductDetailUtil(ProductDetail).getById(
      id,
      references
    );
    return { status: 200, error: undefined, data: productDetail || {} };
  }

  async store({ auth, request }) {
    const { body, qs } = request;

    const {
      product_id,
      product_price,
      product_bid_start,
      product_bid_increment,
      product_description,
    } = body;

    const { references } = qs;

    const { admin, error } = await performAuthentication(auth).validateAdmin();

    if (error)
      return {
        status: 403,
        error,
        data: undefined,
      };

    if (admin)
      return {
        status: 403,
        error: "This action is reserved for regular user only.",
        data: undefined,
      };

    const { customer_id } = await performAuthentication(auth).validateIdParam(
      Customer
    );

    const existingProduct = await makeProductDetailUtil(
      ProductDetail
    ).findExistingProductViaUser(User, customer_id, product_id);

    if (!existingProduct)
      return {
        status: 404,
        error: "product does not seem to exist.",
        data: undefined,
      };

    const validation = await productDetailValidator(request.body);

    if (validation.error) {
      return { status: 422, error: validation.error, data: undefined };
    }

    const productDetail = await makeProductDetailUtil(ProductDetail).create(
      {
        product_price,
        product_bid_start,
        product_bid_increment,
        product_description,
      },
      references
    );

    return {
      status: 200,
      error: undefined,
      data: productDetail,
    };
  }

  async update({ request }) {
    const { body, params, qs } = request;

    const { id } = params;

    const { references } = qs;

    const {
      product_price,
      product_bid_start,
      product_bid_increment,
      product_description,
    } = body;

    const productDetail = await makeProductDetailUtil(ProductDetail).updateById(
      id,
      {
        product_price,
        product_bid_start,
        product_bid_increment,
        product_description,
      },
      references
    );
    return { status: 200, error: undefined, data: productDetail };
  }

  async destroy({ request }) {
    const { id } = request.params;

    const productDetail = await makeProductDetailUtil(ProductDetail).deleteById(
      id
    );

    return {
      status: 200,
      error: undefined,
      data: { massage: `${productDetail} is successfully removed.` },
    };
  }
}

module.exports = ProductDetailController;
