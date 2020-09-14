"use strict";

const orderValidator = require("../../../service/orderValidator");
const Order = use("App/Models/Order");
const User = use("App/Models/User");
const Customer = use("App/Models/Customer");
const Product = use("App/Models/Product");
const makeOrderUtil = require("../../../util/OrderUtil.func");
const makeUserUtil = require("../../../util/UserUtil.func");
const makeCustomerUtil = require("../../../util/CustomerUtil.func");
const makeProductUtil = require("../../../util/ProductUtil.func");
const numberTypeParamValidator = require("../../../util/numberTypeParamValidator.func");
const performAuthentication = require("../../../util/authenticate.func");

class OrderController {
  async index({ auth, request }) {
    const { references } = request.qs;

    const { admin, error } = await performAuthentication(auth).validateAdmin();

    if (error)
      return {
        status: 403,
        error: "Access denied. authentication failed.",
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
        error: "Access denied. authentication failed.",
        data: undefined,
      };

    const validateValue = numberTypeParamValidator(id);

    if (validateValue.error)
      return { status: 422, error: validateValue.error, date: undefined };

    if (admin) {
      const order = await makeOrderUtil(Order).getById(id, references);

      return { status: 200, error: undefined, data: order || {} };
    }

    const { customer_id } = await performAuthentication(auth).validateIdParam();

    if (customer_id) {
      const order = await makeCustomerUtil(Customer).findExistingOrders(
        id,
        references
      );

      return { status: 200, error: undefined, data: order || {} };
    }

    return {
      status: 403,
      error: "Access denied. id param does not match your authenticated id.",
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
        error: "Access denied. authentication failed.",
        data: undefined,
      };

    if (admin)
      return {
        status: 403,
        error:
          "Access denied. admin should not be able to perform this action.",
        data: undefined,
      };

    const auth_data = await performAuthentication(auth).validateIdParam(
      Customer
    );

    const authorProduct = await makeCustomerUtil(
      Customer
    ).findProductOnAuthUser(auth_data.customer_id, product_id);

    if (!authorProduct)
      return {
        status: 403,
        error:
          "Access denied. cannot initiate order for product you don't own.",
        data: undefined,
      };

    const existingBidOnYourProduct = await makeProductUtil(
      Product
    ).findExistingBidForThisProduct(customer_id, product_id);

    if (!existingBidOnYourProduct)
      return {
        status: 404,
        error: "Bid not found. this user never put a bid on your product.",
        data: undefined,
      };

    const existingOrderOnThisCustomer = await makeCustomerUtil(
      Customer
    ).findExistingOrder(customer_id, product_id);

    if (existingOrderOnThisCustomer)
      return {
        status: 500,
        error:
          "Duplicate order. order on this specific user has already existed.",
        data: undefined,
      };

    const validation = await orderValidator({
      customer_id,
      product_id,
      order_quantity,
    });

    if (validation.error) {
      return { status: 422, error: validation.error, data: undefined };
    }

    const data = await makeOrderUtil(Order).create(
      { customer_id, product_id, order_quantity },
      references
    );

    return {
      status: 200,
      error: undefined,
      data,
    };
  }

  async update({ auth, request }) {
    const { body, params, qs } = request;

    const { id } = params;

    const { references } = qs;

    const { customer_id, product_id, order_quantity } = body;

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

    const existingOrder = await makeOrderUtil(Order).getById(id);

    if (!existingOrder)
      return {
        status: 404,
        error: "Order not found. order you are looking for does not exist.",
        data: undefined,
      };

    const order = await makeOrderUtil(Order).updateById(
      id,
      { customer_id, product_id, order_quantity },
      references
    );

    return { status: 200, error: undefined, data: order };
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

    const order = await makeOrderUtil(Order).deleteById(id);

    if (!order)
      return {
        status: 404,
        error: "Order not found. order you are looking for does not exist.",
        data: undefined,
      };

    return {
      status: 200,
      error: undefined,
      data: "Order is successfully removed.",
    };
  }
}

module.exports = OrderController;
