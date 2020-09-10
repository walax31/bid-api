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

const sessionData = {};

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

  sessionData.order_id = order_id;
  sessionData.user_id = user_id;
});

test("should return array of row from makePaymentUtil.", async ({ assert }) => {
  const payments = await makePaymentUtil(PaymentModel).getAll("");

  assert.isAbove(payments.rows.length, 0);
});

test("should return object of requested created index from makePaymentUtil.", async ({
  assert,
}) => {
  const payment = await makePaymentUtil(PaymentModel).getById(
    sessionData.order_id,
    ""
  );

  assert.isOk(payment);
});

test("should return modified object of updated index form makePaymentUtil.", async ({
  assert,
}) => {
  const payment = await makePaymentUtil(PaymentModel).updateById(
    sessionData.order_id,
    { status: "accepted" },
    ""
  );

  assert.equal(payment["$attributes"].status, "accepted");
});

test("should return index of deleted index from makePaymentUtil.", async ({
  assert,
}) => {
  assert.plan(2);

  const deletedPayment = await makePaymentUtil(PaymentModel).deleteById(
    sessionData.order_id
  );

  assert.isOk(deletedPayment);

  const deletedUser = await UserModel.find(
    sessionData.user_id
  ).then((response) => response.delete());

  assert.isOk(deletedUser);
});

test("should not return object of requested index from makePaymentUtil.", async ({
  assert,
}) => {
  const payment = await makePaymentUtil(PaymentModel).getById(
    sessionData.order_id,
    ""
  );

  assert.isNotOk(payment);
});
