"use strict";

const { test } = use("Test/Suite")("Order Util");
const OrderModel = use("App/Models/Order");
const CustomerModel = use("App/Models/Customer");
const UserModel = use("App/Models/User");
const makeUserUtil = require("../../util/testerUtil/autogenUserInstance.func");
const makeCustomerUtil = require("../../util/testerUtil/autogenCustomerInstance.func");
const makeOrderUtil = require("../../util/OrderUtil.func");
const makeTestOrderUtil = require("../../util/testerUtil/autogenOrderInstance.func");

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

  const { order_id } = await makeOrderUtil(OrderModel)
    .create({
      customer_id,
    })
    .then((response) => response["$attributes"]);

  assert.isOk(order_id);

  await UserModel.find(user_id).then((response) => response.delete());
});

test("should return array of row from makeOrderUtil.", async ({ assert }) => {
  const { user_id } = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id);

  await makeTestOrderUtil(OrderModel, customer_id);

  const orders = await makeOrderUtil(OrderModel).getAll("");

  assert.isAbove(orders.rows.length, 0);

  await UserModel.find(user_id).then((response) => response.delete());
});

test("should return object of requested created index from makeOrderUtil.", async ({
  assert,
}) => {
  const { user_id } = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id);

  const { order_id } = await makeTestOrderUtil(OrderModel, customer_id);

  const order = await makeOrderUtil(OrderModel).getById(order_id, "");

  assert.isOk(order);

  await UserModel.find(user_id).then((response) => response.delete());
});

test("should return index of deleted index from makeOrderUtil.", async ({
  assert,
}) => {
  const { user_id } = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id);

  const { order_id } = await makeTestOrderUtil(OrderModel, customer_id);

  const deletedOrder = await makeOrderUtil(OrderModel).deleteById(order_id);

  assert.isOk(deletedOrder);

  await UserModel.find(user_id).then((response) => response.delete());
});
