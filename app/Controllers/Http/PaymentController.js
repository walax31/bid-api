"use strict";
const Database = use(`Database`);

const Payment = use("App/Models/Payment");
const makePaymentUtil = require("../../../util/PaymentUtil.func");

function numberTypeParamValidator(number) {
  if (Number.isNaN(parseInt(number))) {
    return {
      error: `param:${number} is not supported,please use number type param intnstead`,
    };
  }
  return {};
}
class PaymentController {
  async index({ request }) {
    const { references = undefined } = request.qs;
    const payment = await makePaymentUtil(Payment).getAll(references);

    return { status: 200, error: undefined, data: Payment };
  }

  async show({ request }) {
    const { id } = request.params;
    const { references } = request.qs;
    const validateValue = numberTypeParamValidator(id);
    if (validateValue.error)
      return { status: 500, error: validateValue.error, date: undefined };
    const payment = await makePaymentUtil(Payment).getAll(references);
    return { status: 200, error: undefined, data: Payment || {} };
  }

  async store({ request }) {
    const { metthod, status, total } = request.body;

    const rules = {
      method: "required",
      status: "required",
      total: "required",
    };
    const payment = await makePaymentUtil(Payment).create(
      { username, email, password },
      rules
    );
    return {
      status: 200,
      error: undefined,
      data: method,
      status,
      total,
    };
  }
  async update({ request }) {
    const { body, params } = request;
    const { id } = params;
    const { method } = body;
    const { status } = body;
    const { total } = body;

    const PayID = await Database.table("payments")
      .where({ order_id: id })
      .update(method, status, total);
    const payment = await Database.table("payments")
      .where({ order_id: PayID })
      .first();

    return { status: 200, error: undefined, data: payment };
  }
  async destroy({ request }) {
    const { id } = request.params;
    await Database.table("payments").where({ order_id: id }).delete();

    return { status: 200, error: undefined, data: { massage: "success" } };
  }
}

module.exports = PaymentController;
