"use strict";

const { test } = use("Test/Suite")("Payment Util");
const PaymentModel = use("App/Models/Payment");
const OrderModel = use("App/Models/Order");
const CustomerModel = use("App/Models/Customer");
const UserModel = use("App/Models/User");
const makeUserUtil = require("../../util/testerUtil/autogenUserInstance.func");
const makeCustomerUtil = require("../../util/testerUtil/autogenCustomerInstance.func");
const makeOrderUtil = require("../../util/testerUtil/autogenOrderInstance.func");
const makePaymentUtil = require("../../util/PaymentUtil.func");

test("should return empty array of rows from makePaymentUtil", async ({
  assert,
}) => {
  const payments = await makePaymentUtil(PaymentModel).getAll("");

  assert.equal(payments.rows.length, 0);
});

test("should return object of created index from makePaymentUtil.", async ({
  assert,
}) => {
  const { user_id } = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id);

  const { order_id } = await makeOrderUtil(OrderModel, customer_id);

  const payment = await makePaymentUtil(PaymentModel).create({
    order_id,
    method: "banking",
    total: 2,
  });

  assert.isOk(payment);

  await UserModel.find(user_id).then((response) => response.delete());
});

test("should return array of row from makePaymentUtil.", async ({ assert }) => {
  const { user_id } = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id);

  const { order_id } = await makeOrderUtil(OrderModel, customer_id);

  await PaymentModel.create({ order_id, method: "banking", total: 2 });

  const payments = await makePaymentUtil(PaymentModel).getAll("");

  assert.isAbove(payments.rows.length, 0);

  await UserModel.find(user_id).then((response) => response.delete());
});

test("should return object of requested created index from makePaymentUtil.", async ({
  assert,
}) => {
  const { user_id } = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id);

  const { order_id } = await makeOrderUtil(OrderModel, customer_id);

  await PaymentModel.create({ order_id, method: "banking", total: 2 });

  const payment = await makePaymentUtil(PaymentModel).getById(order_id, "");

  assert.isOk(payment);

  await UserModel.find(user_id).then((response) => response.delete());
});

test("should return modified object of updated index form makePaymentUtil.", async ({
  assert,
}) => {
  const { user_id } = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id);

  const { order_id } = await makeOrderUtil(OrderModel, customer_id);

  await PaymentModel.create({ order_id, method: "banking", total: 2 });

  const { status } = await makePaymentUtil(PaymentModel)
    .updateById(order_id, { status: "accepted" }, "")
    .then((response) => response["$attributes"]);

  assert.equal(status, "accepted");

  await UserModel.find(user_id).then((response) => response.delete());
});

test("should return index of deleted index from makePaymentUtil.", async ({
  assert,
}) => {
  const { user_id } = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id);

  const { order_id } = await makeOrderUtil(OrderModel, customer_id);

  await PaymentModel.create({ order_id, method: "banking", total: 2 });

  const deletedPayment = await makePaymentUtil(PaymentModel).deleteById(
    order_id
  );

  assert.isOk(deletedPayment);

  await UserModel.find(user_id).then((response) => response.delete());
});
