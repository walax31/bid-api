"use strict";

const Payment = use("App/Models/Payment");
const Order = use("App/Models/Order");
const makePaymentUtil = require("../../../util/PaymentUtil.func");
const makeOrderUtil = require("../../../util/OrderUtil.func");

class PaymentController {
  async index({ request }) {
    const { references, page, per_page } = request.qs;

    switch (request.role) {
      case "admin":
        const payment = await makePaymentUtil(Payment).getAll(
          references,
          page,
          per_page
        );

        return {
          status: 200,
          error: undefined,
          pages: payment.pages,
          data: payment.rows,
        };
      case "customer":
        const customerPayment = await makePaymentUtil(Payment).getAll(
          references,
          page,
          per_page,
          request.customer_uuid
        );

        return {
          status: 200,
          error: undefined,
          pages: customerPayment.pages,
          data: customerPayment.rows,
        };
      default:
    }
  }

  async show({ request }) {
    const { params, qs } = request;

    const { id } = params;

    const { references } = qs;

    const payment = await makePaymentUtil(Payment).getById(id, references);

    return { status: 200, error: undefined, data: payment || {} };
  }

  async store({ request }) {
    const { body, qs } = request;

    const { uuid, method, status, total } = body;

    const { references } = qs;

    const existingPayment = await makePaymentUtil(Payment).findExistingPayment(
      uuid
    );

    if (existingPayment)
      return {
        status: 500,
        error: "Duplicate payment. payment already existed.",
      };

    const existingOrder = await makeOrderUtil(Order).getById(uuid);

    if (!existingOrder)
      return {
        status: 404,
        error: "Order not found. you never ordered this product.",
      };

    const payment = await makePaymentUtil(Payment).create(
      {
        method,
        status,
        total,
        uuid,
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

    const existingPayment = await makePaymentUtil(Payment).getById(id);

    if (!existingPayment)
      return {
        status: 404,
        error: "Payment not found. payment you are looking for does not exist.",
        data: undefined,
      };

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

    if (!payment)
      return {
        status: 404,
        error: "Payment not found. payment you are looking for does not exist.",
        data: undefined,
      };

    return {
      status: 200,
      error: undefined,
      data: "Payment is successfully removed.",
    };
  }
}

module.exports = PaymentController;
