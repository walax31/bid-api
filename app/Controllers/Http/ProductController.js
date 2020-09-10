"use strict";

const productValidator = require("../../../service/productValidator");
const Product = use("App/Models/Product");
const makeProductUtil = require("../../../util/ProductUtil.func");
const numberTypeParamValidator = require("../../../util/numberTypeParamValidator.func");

class ProductController {
  async index({ request }) {
    const { references } = request.qs;

    const products = await makeProductUtil(Product).getAll(references);

    return { status: 200, error: undefined, data: products };
  }

  async show({ request }) {
    const { params, qs } = request;

    const { id } = params;

    const { references } = qs;

    const validateValue = numberTypeParamValidator(id);

    if (validateValue.error)
      return { status: 500, error: validateValue.error, date: undefined };

    const product = await makeProductUtil(Product).getById(references, id);

    return { status: 200, error: undefined, data: product || {} };
  }
  
  async store({ request }) {
    const { body, qs } = request;

    const { customer_id, product_name, end_date, stock } = body;

    const { references } = qs;

    const validation = await productValidator(request.body);

    if (validation.error) {
      return { status: 422, error: validation.error, data: undefined };
    }

    const product = await makeProductUtil(Product).create(
      {
        customer_id,
        product_name,
        end_date,
        stock,
      },
      references
    );

    return {
      status: 200,
      error: undefined,
      data: product,
    };
  }

  async update({ request }) {
    const { body, params, qs } = request;

    const { id } = params;

    const { references } = qs;

    const { customer_id, product_name, end_date, stock } = body;

    const product = await makeProductUtil(Product).updateById(
      id,
      { customer_id, product_name, end_date, stock },
      references
    );

    return { status: 200, error: undefined, data: product };
  }

  async destroy({ request }) {
    const { id } = request.params;

    const product = await makeProductUtil(Product).deleteById(id);

    return {
      status: 200,
      error: undefined,
      data: { massage: `${product} is successfully removed.` },
    };
  }
}

module.exports = ProductController;
