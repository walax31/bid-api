"use strict";

const Database = use(`Database`);

const Order = use("App/Models/Order");
const makeOrderUtil = require("../../../util/OrderUtil.func");

function numberTypeParamValidator(number) {
  if (Number.isNaN(parseInt(number))) {
    return {
      error: `param:${number} is not supported,please use number type param intnstead`,
    };
  }
  return {};
}
class OrderController {
  async index({ request }) {
    const { references = undefined } = request.qs;
    const order = await makeOrderUtil(Order).getAll(references);

    return { status: 200, error: undefined, data: order };
  }

  async show({ request }) {
    const { id } = request.params;
    const { references } = request.qs;
    const validateValue = numberTypeParamValidator(id);
    if (validateValue.error)
      return { status: 500, error: validateValue.error, date: undefined };
    const order = await makeUserUtil(Order).getAll(references);
    return { status: 200, error: undefined, data: Order || {} };
  }

  async store({ request }) {
    const { customer_id } = request.body;

    const rules = {
      customer_id: "required",
    };
    const order = await makeOrderUtil(Order).create({ customer_id }, rules);
    return {
      status: 200,
      error: undefined,
      data: customer_id,
    };
  }
  async update({ request }) {}
  async destroy({ request }) {
    const { id } = request.params;
    await Database.table("orders").where({ order_id: id }).delete();

    return { status: 200, error: undefined, data: { massage: "success" } };
  }
}

module.exports = OrderController;
