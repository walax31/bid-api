"use strict";

const orderValidator = require("../../../service/orderValidator");
const Order = use("App/Models/Order");
const User = use("App/Models/User");
const Customer = use("App/Models/Customer");
const makeOrderUtil = require("../../../util/OrderUtil.func");
const makeUserUtil = require("../../../util/UserUtil.func");
const numberTypeParamValidator = require("../../../util/numberTypeParamValidator.func");
const performAuthentication = require("../../../util/authenticate.func");

class OrderController {
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
      const orders = await makeOrderUtil(Order).getAll(references);

      return { status: 200, error: undefined, data: orders };
    }

    const { customer_id } = await performAuthentication(auth).validateIdParam(
      Customer
    );

    const orders = await makeOrderUtil(Order).getAll(references, customer_id);

    return { status: 200, error: undefined, data: orders };
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
      const order = await makeOrderUtil(Order).getById(id, references);

      return { status: 200, error: undefined, data: order || {} };
    }

    const { customer_id } = await performAuthentication(auth).validateIdParam();

    if (customer_id === parseInt(id)) {
      const order = await makeOrderUtil(Order).getById(id, references);

      return { status: 200, error: undefined, data: order || {} };
    }

    return {
      status: 200,
      error: "id param does not match performAuthenticationd id.",
      data: undefined,
    };
  }

  async store({ auth, request }) {
    const { body, qs } = request;

    const { customer_id, product_id, order_quantity } = body;

    const { references } = qs;

    const { admin, error } = await performAuthentication(auth).validateAdmin();

    if (error)
      return {
        status: 403,
        error,
        data: undefined,
      };

    if (admin)
      return {
        status: 403,
        error: "admin should not be able to perform this action.",
        data: undefined,
      };

    const auth_data = await performAuthentication(auth).validateIdParam(
      Customer
    );

    const validation = await orderValidator({
      customer_id,
      product_id,
      order_quantity,
    });

    if (validation.error) {
      return { status: 422, error: validation.error, data: undefined };
    }

    const { status, error_msg, data } = await makeOrderUtil(Order).create(
      { customer_id, product_id, order_quantity },
      User,
      auth_data.customer_id,
      customer_id,
      product_id,
      references
    );

    return {
      status,
      error: error_msg,
      data,
    };
  }

  async update({ request }) {
    const { body, params, qs } = request;

    const { id } = params;

    const { references } = qs;

    const { customer_id } = body;

    const order = await makeOrderUtil(Order).updateById(
      id,
      { customer_id },
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
