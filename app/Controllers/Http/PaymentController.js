"use strict";

const paymentValidator = require("../../../service/paymentValidator");
const Payment = use("App/Models/Payment");
const makePaymentUtil = require("../../../util/PaymentUtil.func");
const numberTypeParamValidator = require("../../../util/numberTypeParamValidator.func");

class PaymentController {
  async index({ request }) {
    const { references } = request.qs;

    const payments = await makePaymentUtil(Payment).getAll(references);

    return { status: 200, error: undefined, data: payments };
  }

  async show({ request }) {
    const { params, qs } = request;

    const { id } = params;

    const { references } = qs;

    const validateValue = numberTypeParamValidator(id);

    if (validateValue.error)
      return { status: 500, error: validateValue.error, date: undefined };

    const payment = await makePaymentUtil(Payment).getById(id, references);

    return { status: 200, error: undefined, data: payment || {} };
  }

  async store({ request }) {
    const { body, qs } = request;

    const { method, status, total } = body;

    const { references } = qs;

    const validation = await paymentValidator(request.body);

    if (validation.error) {
      return { status: 422, error: validation.error, data: undefined };
    }

    const payment = await makePaymentUtil(Payment).create(
      {
        method,
        status,
        total,
      },
      references
    );

    return {
      status: 200,
      error: undefined,
      data: payment,
    };
  }

  async update({ request }) {
    const { body, params, qs } = request;

    const { id } = params;

    const { references } = qs;

    const { method, status, total } = body;

    const payment = await makePaymentUtil(Payment).updateById(
      id,
      { method, status, total },
      references
    );

    return { status: 200, error: undefined, data: payment };
  }

  async destroy({ request }) {
    const { id } = request.params;

    const payment = await makePaymentUtil(Payment).deleteById(id);

    return {
      status: 200,
      error: undefined,
      data: { massage: `${payment} is successfully removed.` },
    };
  }
}

module.exports = PaymentController;
