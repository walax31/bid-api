"use strict";

const Database = use(`Database`);

const OrderDetail = use("App/Models/OrderDetail");
const makeOrderDetailUtil = require("../../../util/OrderDetailUtil.func");

function numberTypeParamValidator(number) {
  if (Number.isNaN(parseInt(number))) {
    return {
      error: `param:${number} is not supported,please use number type param intnstead`,
    };
  }
  return {};
}

function numberTypeParamValidator(number) {
  if (Number.isNaN(parseInt(number))) {
    return {
      error: `param:${number} is not supported,please use number type param intnstead`,
    };
  }
  return {};
}
class OrderDetailController {
  async index({ request }) {
    const { references = undefined } = request.qs;
    const orderDetail = await makeOrderDetailUtil(OrderDetail).getAll(
      references
    );

    return { status: 200, error: undefined, data: orderDetail };
  }

  async show({ request }) {
    const { id } = request.params;
    const { references } = request.qs;
    const validateValue = numberTypeParamValidator(id);
    if (validateValue.error)
      return { status: 500, error: validateValue.error, date: undefined };
    const orderDetail = await makeOrderDetailUtil(OrderDetail).getAll(
      references
    );
    return { status: 200, error: undefined, data: OrderDetail || {} };
  }

  async store({ request }) {
    const {
      product_id,
      order_detail_id,
      order_quantity,
      order_id,
    } = request.body;

    const rules = {
      product_id: "required",
      order_detail_id: "required",
      order_quantity: "required",
      order_id: "required",
    };
    const orderDetail = await makeOrderDetailUtil(OrderDetail).create(
      { product_id, order_quantity, order_id },
      rules
    );
    return {
      status: 200,
      error: undefined,
      data: product_id,
      order_quantity,
      order_id,
    };
  }
  async update({ request }) {
    const { body, params } = request;
    const { id } = params;
    const { product_id } = body;
    const { order_quantity } = body;
    const { order_id } = body;

    const orderDetailID = await Database.table("order_details")
      .where({ order_detail_id: id })
      .update({ product_id, order_quantity, order_id });
    const order = await Database.table("order_details")
      .where({ order_detail_id: orderDetailID })
      .first();

    return { status: 200, error: undefined, data: orderDetail };
  }
  async destroy({ request }) {
    const { id } = request.params;
    await Database.table("order_details")
      .where({ order_detail_id: id })
      .delete();

    return { status: 200, error: undefined, data: { massage: "success" } };
  }
}

module.exports = OrderDetailController;
