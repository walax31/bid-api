"use strict";

const { test } = use("Test/Suite")("CRU Order Util");
const makeOrderUtil = require("../../util/OrderUtil.func");
const OrderModel = use("App/Models/Order");

test("should return empty array of rows from makeOrderUtil", async ({
  assert,
}) => {
  const testSubject = await makeOrderUtil(OrderModel).getAll("");

  assert.equal(testSubject.rows.length, 0);
});

test("should return object of created index from makeOrderUtil.", async ({
  assert,
}) => {
  const testSubject = await makeOrderUtil(OrderModel).create({
    customer_id: 1,
    customer_id: 1,
  });

  assert.isOk(testSubject);
});

test("should return array of row from makeOrderUtil.", async ({ assert }) => {
  const testSubject = await makeOrderUtil(OrderModel).getAll("");

  assert.isArray(testSubject.rows);
});

test("should return object of requested created index from makeOrderUtil.", async ({
  assert,
}) => {
  const testSubject = await makeOrderUtil(OrderModel).getById(1, "");

  assert.isOk(testSubject);
});
