"use strict";

const orderDetailValidator = require("../../../service/orderDetailValidator");
const OrderDetail = use("App/Models/OrderDetail");
const makeOrderDetailUtil = require("../../../util/OrderDetailUtil.func");
const numberTypeParamValidator = require("../../../util/numberTypeParamValidator.func");

class OrderDetailController {
  async index({ request }) {
    const { references } = request.qs;

    const orderDetails = await makeOrderDetailUtil(OrderDetail).getAll(
      references
    );

    return { status: 200, error: undefined, data: orderDetails };
  }

  async show({ request }) {
    const { params, qs } = request;

    const { id } = params;

    const { references } = qs;

    const validateValue = numberTypeParamValidator(id);

    if (validateValue.error)
      return { status: 500, error: validateValue.error, date: undefined };

    const orderDetail = await makeOrderDetailUtil(OrderDetail).getById(
      references,
      id
    );

    return { status: 200, error: undefined, data: orderDetail || {} };
  }

  async store({ request }) {
    const { body, qs } = request;

    const { product_id, order_quantity, order_id } = body;

    const { references } = qs;

    const validation = await orderDetailValidator(request.body);

    if (validation.error) {
      return { status: 422, error: validation.error, data: undefined };
    }

    const orderDetail = await makeOrderDetailUtil(OrderDetail).create(
      { product_id, order_quantity, order_id },
      references
    );

    return {
      status: 200,
      error: undefined,
      data: orderDetail,
    };
  }

  async update({ request }) {
    const { body, params, qs } = request;

    const { id } = params;

    const { references } = qs;

    const { product_id, order_quantity, order_id } = body;

    const orderDetail = await makeOrderDetailUtil(OrderDetail).updateById(
      id,
      { product_id, order_quantity, order_id },
      references
    );

    return { status: 200, error: undefined, data: orderDetail };
  }

  async destroy({ request }) {
    const { id } = request.params;

    const orderDetail = await makeOrderUtil(OrderDetail).deleteById(id);

    return {
      status: 200,
      error: undefined,
      data: { message: `${orderDetail} is successfully removed.` },
    };
  }
}

module.exports = OrderDetailController;
