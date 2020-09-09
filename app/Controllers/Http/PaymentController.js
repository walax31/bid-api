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

    return { status: 200, error: undefined, data: payment };
  }

  async show({ request }) {
    const { id } = request.params;
    const { references } = request.qs;

    const validateValue = numberTypeParamValidator(id);
    if (validateValue.error)
      return { status: 500, error: validateValue.error, date: undefined };

    const payment = await makePaymentUtil(Payment).getAll(references);
    return { status: 200, error: undefined, data: payment || {} };
  }
  async store({ request }) {
    const { method, status, total } = request.body;

    const rules = {
      method: "required",

      end_date: "required",
      stock: "required",
    };
    const payment = await makePaymentUtil(Payment).create(
      {
        method,
        status,
        total,
      },
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

    const paymentID = await Database.table("payments")
      .where({ order_id: id })
      .update({
        method,
        status,
        total,
      });
    const payment = await Database.table("payments")
      .where({ order_id: paymentID })
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
