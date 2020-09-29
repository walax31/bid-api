"use strict";

const productDetailValidator = require("../../../service/productDetailValidator");
const ProductDetail = use("App/Models/ProductDetail");
const Customer = use("App/Models/Customer");
const Product = use("App/Models/Product");
const makeProductDetailUtil = require("../../../util/ProductDetailUtil.func");
const makeProductUtil = require("../../../util/ProductUtil.func");
const makeCustomerUtil = require("../../../util/CustomerUtil.func");
const numberTypeParamValidator = require("../../../util/numberTypeParamValidator.func");
const performAuthentication = require("../../../util/authenticate.func");

class ProductDetailController {
  async index({ request }) {
    const { references, page, per_page } = request.qs;

    const { rows, pages } = await makeProductDetailUtil(ProductDetail).getAll(
      references,
      page,
      per_page
    );

    return { status: 200, error: undefined, pages, data: rows };
  }

  async show({ request }) {
    const { params, qs } = request;

    const { id } = params;

    const { references } = qs;

    // const validateValue = numberTypeParamValidator(id);

    // if (validateValue.error)
    //   return { status: 422, error: validateValue.error, date: undefined };

    const productDetail = await makeProductDetailUtil(ProductDetail).getById(
      id,
      references
    );
    return { status: 200, error: undefined, data: productDetail || {} };
  }

  async store({ auth, request }) {
    const { body, qs } = request;

    const {
      uuid,
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
        error: "Access denied. authentication failed.",
        data: undefined,
      };

    if (admin)
      return {
        status: 403,
        error: "Access denied. this action is reserved for regular user only.",
        data: undefined,
      };

    const { customer_uuid } = await performAuthentication(
      auth
    ).validateUniqueID(Customer);

    const validation = await productDetailValidator(request.body);

    if (validation.error) {
      return { status: 422, error: validation.error, data: undefined };
    }

    const existingProduct = await makeCustomerUtil(
      Customer
    ).findProductOnAuthUser(customer_uuid, uuid);

    if (!existingProduct)
      return {
        status: 404,
        error: "Product not found. product does not seem to exist.",
        data: undefined,
      };

    const productDetail = await makeProductDetailUtil(ProductDetail).create(
      {
        uuid,
        product_price,
        product_bid_start,
        product_bid_increment,
        product_description,
      },
      references
    );

    const flaggedProduct = await makeProductUtil(Product).flagProductAsBiddable(
      uuid
    );

    if (!flaggedProduct)
      return {
        status: 500,
        error: "Internal error. failed to flag product as biddable.",
      };

    return {
      status: 200,
      error: undefined,
      data: productDetail,
    };
  }

  async update({ auth, request }) {
    const { body, params, qs } = request;

    const { id } = params;

    const { references } = qs;

    const { admin, error } = await performAuthentication(auth).validateAdmin();

    if (error)
      return {
        status: 403,
        error: "Access denied. authentication failed.",
        data: undefined,
      };

    if (!admin)
      return {
        status: 403,
        error: "Access denied. admin validation failed.",
        data: undefined,
      };

    const product = await makeProductDetailUtil(ProductDetail).getById(id);

    if (!product)
      return {
        status: 404,
        error: "Product not found. product you are looking for does not exist.",
        data: undefined,
      };

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

  async destroy({ auth, request }) {
    const { id } = request.params;

    const { error, admin } = await performAuthentication(auth).validateAdmin();

    if (error)
      return {
        status: 403,
        error: "Access denied. authentication failed.",
        data: undefined,
      };

    if (!admin)
      return {
        status: 403,
        error: "Access denied. admin validation failed.",
      };

    const productDetail = await makeProductDetailUtil(ProductDetail).deleteById(
      id
    );

    if (!productDetail)
      return {
        status: 404,
        error: "Product not found. product you are looking for does not exist.",
        data: undefined,
      };

    return {
      status: 200,
      error: undefined,
      data: "productDetail is successfully removed.",
    };
  }
}

module.exports = ProductDetailController;
