"use strict";

const orderValidator = require("../../../service/orderValidator");
const Order = use("App/Models/Order");
const makeOrderUtil = require("../../../util/OrderUtil.func");
const numberTypeParamValidator = require("../../../util/numberTypeParamValidator.func");

class OrderController {
  async index({ request }) {
    const { references } = request.qs;

    const orders = await makeOrderUtil(Order).getAll(references);

    return { status: 200, error: undefined, data: orders };
  }

  async show({ request }) {
    const { params, qs } = request;

    const { id } = params;

    const { references } = qs;

    const validateValue = numberTypeParamValidator(id);

    if (validateValue.error)
      return { status: 500, error: validateValue.error, date: undefined };

    const order = await makeOrderUtil(Order).getById(id, references);

    return { status: 200, error: undefined, data: order || {} };
  }

  async store({ request }) {
    const { body, qs } = request;

    const { customer_id,product_id,order_quantity } = body;

    const { references } = qs;

    const validation = await orderValidator(request.body);

    if (validation.error) {
      return { status: 422, error: validation.error, data: undefined };
    }

    const order = await makeOrderUtil(Order).create(
      { customer_id ,product_id,order_quantity},
      references
    );

    return {
      status: 200,
      error: undefined,
      data: order,
    };
  }

  async update({ request }) {
    const { body, params, qs } = request;

    const { id } = params;

    const { references } = qs;

    const { customer_id,product_id,order_quantity } = body;

    const order = await makeOrderUtil(Order).updateById(
      id,
      { customer_id,product_id,order_quantity },
      references
    );

    return { status: 200, error: undefined, data: order };
  }

  async destroy({ request }) {
    const { id } = request.params;

    const order = await makeOrderUtil(Order).deleteById(id);

    return {
      status: 200,
      error: undefined,
      data: { massage: `${order} is successfully removed.` },
    };
  }
}

module.exports = OrderController;
