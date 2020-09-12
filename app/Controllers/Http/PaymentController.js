"use strict";

const paymentValidator = require("../../../service/paymentValidator");
const Payment = use("App/Models/Payment");
const Customer = use("App/Models/Customer");
const Order = use("App/Models/Order");
const makePaymentUtil = require("../../../util/PaymentUtil.func");
const numberTypeParamValidator = require("../../../util/numberTypeParamValidator.func");
const performAuthentication = require("../../../util/authenticate.func");

class PaymentController {
  async index({ auth, request }) {
    const { references } = request.qs;

    const { admin, error } = await performAuthentication(auth).validateAdmin();

    if (error)
      return {
        status: 403,
        error,
        data: undefined,
      };

    if (admin) {
      const payments = await makePaymentUtil(Payment).getAll(references);

      return { status: 200, error: undefined, data: payments };
    }

    const { customer_id } = await performAuthentication(auth).validateIdParam(
      Customer
    );

    const payments = await makePaymentUtil(Payment).getAll(
      references,
      customer_id
    );

    return { status: 200, error: undefined, data: payments };
  }

  async show({ auth, request }) {
    const { params, qs } = request;

    const { id } = params;

    const { references } = qs;

    const { admin, error } = await performAuthentication(auth).validateAdmin();

    if (error)
      return {
        status: 403,
        error,
        data: undefined,
      };

    const validateValue = numberTypeParamValidator(id);

    if (validateValue.error)
      return { status: 500, error: validateValue.error, date: undefined };

    if (admin) {
      const payment = await makePaymentUtil(Payment).getById(id, references);

      return { status: 200, error: undefined, data: payment || {} };
    }

    const { customer_id } = await performAuthentication(auth).validateIdParam(
      Customer
    );

    if (customer_id === parseInt(id)) {
      const payment = await makePaymentUtil(Payment).getById(id, references);

      return { status: 200, error: undefined, data: payment || {} };
    }

    return {
      status: 200,
      error: "id param does not match credential id.",
      data: undefined,
    };
  }

  async store({ auth, request }) {
    const { body, qs } = request;

    const { method, status, total } = body;

    const { references } = qs;

    const { error } = performAuthentication(auth).authenticate();

    if (error)
      return {
        status: 403,
        error,
        data: undefined,
      };

    const validation = await paymentValidator(request.body);

    if (validation.error) {
      return { status: 422, error: validation.error, data: undefined };
    }

    const { customer_id } = await performAuthentication(auth).validateIdParam(
      Customer
    );

    const payment = await makePaymentUtil(Payment).create(
      {
        method,
        status,
        total,
      },
      Order,
      customer_id,
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
