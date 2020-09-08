"use strict";
const Database = use(`Database`);
const Product = use("App/Models/Product");
const makeProductUtil = require("../../../ProductlUtil.funct");

function numberTypeParamValidator(number) {
  if (Number.isNaN(parseInt(number))) {
    return {
      error: `param:${number} is not supported,please use number type param intnstead`,
    };
  }
  return {};
}
class ProductController {
  async index({ request }) {
    const { references = undefined } = request.qs;
    const product = await makeProductUtil(Product).getAll(references);

    return { status: 200, error: undefined, data: product };
  }

  async show({ request }) {
    const { id } = request.params;
    const { references } = request.qs;

    const validateValue = numberTypeParamValidator(id);
    if (validateValue.error)
      return { status: 500, error: validateValue.error, date: undefined };

    const product = await makeProductUtil(Product).getAll(references);
    return { status: 200, error: undefined, data: product || {} };
  }
  async store({ request }) {
    const { customer_id, product_name, end_date, stock } = request.body;

    const rules = {
      customer_id: "required",
      product_name: "required",
      end_date: "required",
      stock: "required",
    };
    const product = await makeProductUtil(Product).create(
      {
        customer_id,
        product_name,
        end_date,
        stock,
      },
      rules
    );
    return {
      status: 200,
      error: undefined,
      data: customer_id,
      product_name,
      end_date,
      stock,
    };
  }
  async update({ request }) {
    const { body, params } = request;
    const { id } = params;
    const { customer_id } = body;
    const { product_name } = body;
    const { end_date } = body;
    const { stock } = body;

    const productID = await Database.table("products")
      .where({ product_id: id })
      .update({
        customer_id,
        product_name,
        end_date,
        stock,
      });
    const product = await Database.table("products")
      .where({ product_id: productID })
      .first();

    return { status: 200, error: undefined, data: product };
  }
  async destroy({ request }) {
    const { id } = request.params;
    await Database.table("products").where({ product_id: id }).delete();

    return { status: 200, error: undefined, data: { massage: "success" } };
  }
}

module.exports = ProductController;
