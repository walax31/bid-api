"use strict";

const { test } = use("Test/Suite")("Order Util");
const OrderModel = use("App/Models/Order");
const CustomerModel = use("App/Models/Customer");
const UserModel = use("App/Models/User");
const makeUserUtil = require("../../util/testerUtil/autogenUserInstance.func");
const makeCustomerUtil = require("../../util/testerUtil/autogenCustomerInstance.func");
const makeOrderUtil = require("../../util/OrderUtil.func");

const sessionData = {};

test("should return empty array of rows from makeOrderUtil", async ({
  assert,
}) => {
  const orders = await makeOrderUtil(OrderModel).getAll("");

  assert.equal(orders.rows.length, 0);
});

test("should return object of created index from makeOrderUtil.", async ({
  assert,
}) => {
  const { user_id } = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id);

  const order = await makeOrderUtil(OrderModel).create({
    customer_id,
  });

  const { order_id } = order["$attributes"];

  assert.isOk(order_id);

  sessionData.order_id = order_id;
  sessionData.user_id = user_id;
});

test("should return array of row from makeOrderUtil.", async ({ assert }) => {
  const orders = await makeOrderUtil(OrderModel).getAll("");

  assert.isAbove(orders.rows.length, 0);
});

test("should return object of requested created index from makeOrderUtil.", async ({
  assert,
}) => {
  const order = await makeOrderUtil(OrderModel).getById(
    sessionData.order_id,
    ""
  );

  assert.isOk(order);
});

test("should return index of deleted index from makeOrderUtil.", async ({
  assert,
}) => {
  assert.plan(2);

  const deletedOrder = await makeOrderUtil(OrderModel).deleteById(
    sessionData.order_id
  );

  assert.isOk(deletedOrder);

  const deletedUser = await UserModel.find(
    sessionData.user_id
  ).then((response) => response.delete());

  assert.isOk(deletedUser);
});

test("should not return object of requested index from makeOrderUtil.", async ({
  assert,
}) => {
  const order = await makeOrderUtil(OrderModel).getById(
    sessionData.order_id,
    ""
  );

  assert.isNotOk(order);
});
