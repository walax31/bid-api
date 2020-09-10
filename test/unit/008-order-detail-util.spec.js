"use strict";

const { test } = use("Test/Suite")("Order Detail Util");
const OrderDetailModel = use("App/Models/OrderDetail");
const OrderModel = use("App/Models/Order");
const ProductModel = use("App/Models/Product");
const CustomerModel = use("App/Models/Customer");
const UserModel = use("App/Models/User");
const makeUserUtil = require("../../util/testerUtil/autogenUserInstance.func");
const makeCustomerUtil = require("../../util/testerUtil/autogenCustomerInstance.func");
const makeProductUtil = require("../../util/testerUtil/autogenProductInstance.func");
const makeOrderUtil = require("../../util/testerUtil/autogenOrderInstance.func");
const makeOrderDetailUtil = require("../../util/OrderDetailUtil.func");

const sessionData = {};

test("should return empty array of rows from makeOrderDetailUtil", async ({
  assert,
}) => {
  const orderDetails = await makeOrderDetailUtil(OrderDetailModel).getAll("");

  assert.equal(orderDetails.rows.length, 0);
});

test("should return object of created index from makeOrderDetailUtil.", async ({
  assert,
}) => {
  const { user_id } = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id);

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  const { order_id } = await makeOrderUtil(OrderModel, customer_id);

  const orderDetail = await makeOrderDetailUtil(OrderDetailModel).create({
    product_id,
    order_quantity: 1,
    order_id,
  });

  const { order_detail_id } = orderDetail["$attributes"];

  assert.isOk(order_detail_id);

  sessionData.order_detail_id = order_detail_id;
  sessionData.user_id = user_id;
});

test("should return array of row from makeOrderDetailUtil.", async ({
  assert,
}) => {
  const orderDetails = await makeOrderDetailUtil(OrderDetailModel).getAll("");

  assert.isAbove(orderDetails.rows.length, 0);
});

test("should return object of requested created index from makeOrderDetailUtil.", async ({
  assert,
}) => {
  const orderDetail = await makeOrderDetailUtil(OrderDetailModel).getById(
    sessionData.order_detail_id,
    ""
  );

  assert.isOk(orderDetail);
});

test("should return modified object of updated index form makeOrderDetailUtil.", async ({
  assert,
}) => {
  const orderDetail = await makeOrderDetailUtil(OrderDetailModel).updateById(
    sessionData.order_detail_id,
    { order_quantity: 2 },
    ""
  );

  assert.equal(orderDetail["$attributes"].order_quantity, 2);
});

test("should return index of deleted index from makeOrderDetailUtil.", async ({
  assert,
}) => {
  assert.plan(2);

  const deletedOrderDetail = await makeOrderDetailUtil(
    OrderDetailModel
  ).deleteById(sessionData.order_detail_id);

  assert.isOk(deletedOrderDetail);

  const deletedUser = await UserModel.find(
    sessionData.user_id
  ).then((response) => response.delete());

  assert.isOk(deletedUser);
});

test("should not return object of requested index from makeOrderDetailUtil.", async ({
  assert,
}) => {
  const orderDetail = await makeOrderDetailUtil(OrderDetailModel).getById(
    sessionData.order_detail_id,
    ""
  );

  assert.isNotOk(orderDetail);
});
