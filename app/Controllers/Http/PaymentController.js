"use strict";

const paymentValidator = require("../../../service/paymentValidator");
const Payment = use("App/Models/Payment");
const Customer = use("App/Models/Customer");
const Order = use("App/Models/Order");
const makePaymentUtil = require("../../../util/PaymentUtil.func");
const makeOrderUtil = require("../../../util/OrderUtil.func");
const makeCustomerUtil = require("../../../util/CustomerUtil.func");
const numberTypeParamValidator = require("../../../util/numberTypeParamValidator.func");
const performAuthentication = require("../../../util/authenticate.func");

class PaymentController {
  async index({ auth, request }) {
    const { references, page, per_page } = request.qs;

    const { admin, error } = await performAuthentication(auth).validateAdmin();

    if (error)
      return {
        status: 403,
        error: "Access denied. authentication failed.",
        data: undefined,
      };

    if (admin) {
      const { rows, pages } = await makePaymentUtil(Payment).getAll(
        references,
        page,
        per_page
      );

      return { status: 200, error: undefined, pages, data: rows };
    }

    const { customer_uuid } = await performAuthentication(
      auth
    ).validateUniqueID(Customer);

    const { rows, pages } = await makePaymentUtil(Payment).getAll(
      references,
      page,
      per_page,
      customer_uuid
    );

    return { status: 200, error: undefined, pages, data: rows };
  }

  async show({ auth, request }) {
    const { params, qs } = request;

    const { id } = params;

    const { references } = qs;

    const { admin, error } = await performAuthentication(auth).validateAdmin();

    if (error)
      return {
        status: 403,
        error: "Access denied. authentication failed.",
        data: undefined,
      };

    //     const validateValue = numberTypeParamValidator(id);

    //     if (validateValue.error)
    //       return { status: 500, error: validateValue.error, date: undefined };

    if (admin) {
      const payment = await makePaymentUtil(Payment).getById(id, references);

      return { status: 200, error: undefined, data: payment || {} };
    }

    const { customer_uuid } = await performAuthentication(
      auth
    ).validateUniqueID(Customer);

    if (customer_uuid) {
      const payment = await makePaymentUtil(Payment).getById(id, references);

      return { status: 200, error: undefined, data: payment || {} };
    }

    return {
      status: 403,
      error: "Access denied. invalid credential.",
      data: undefined,
    };
  }

  async store({ auth, request }) {
    const { body, qs } = request;

    const { uuid, method, status, total } = body;

    const { references } = qs;

    const { error } = performAuthentication(auth).authenticate();

    if (error)
      return {
        status: 403,
        error: "Access denied. authentication failed.",
        data: undefined,
      };
    const { customer_uuid } = await performAuthentication(
      auth
    ).validateUniqueID(Customer);

    const validatedCredential = await makeCustomerUtil(
      Customer
    ).hasCredentialValidated(customer_uuid);

    if (!validatedCredential)
      return {
        status: 403,
        error: "Access denied. invalid credential.",
        data: undefined,
      };

    const validation = await paymentValidator(body);

    if (validation.error) {
      return { status: 422, error: validation.error, data: undefined };
    }

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

  async update({ auth, request }) {
    const { body, params, qs } = request;

    const { id } = params;

    const { references } = qs;

    const { method, status, total } = body;

    const { admin, error } = await performAuthentication(auth).validateAdmin();

    if (error)
      return {
        status: 403,
        error: "Access denied. authentication failed.",
        data: undefined,
      };

    if (!admin)
      return {
        status: 403,
        error: "Access denied. admin validation failed.",
        data: undefined,
      };

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

  async destroy({ auth, request }) {
    const { id } = request.params;

    const { admin, error } = await performAuthentication(auth).validateAdmin();

    if (error)
      return {
        status: 403,
        error: "Access denied. authentication failed.",
        data: undefined,
      };

    if (!admin)
      return {
        status: 403,
        error: "Access denied. admin validation failed.",
        data: undefined,
      };

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
