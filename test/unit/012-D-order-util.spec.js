"use strict";

const { test } = use("Test/Suite")("D Order Util");
const makeOrderUtil = require("../../util/OrderUtil.func");
const OrderModel = use("App/Models/Order");

test("should return index of deleted index from makeOrderUtil.", async ({
  assert,
}) => {
  const testSubject = await makeOrderUtil(OrderModel).deleteById(1);

  assert.isOk(testSubject);
});

test("should not return object of requested index from makeOrderUtil.", async ({
  assert,
}) => {
  const testSubject = await makeOrderUtil(OrderModel).getById(1, "");

  assert.isNotOk(testSubject);
});
