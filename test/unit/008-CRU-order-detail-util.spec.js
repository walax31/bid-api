"use strict";

const { test } = use("Test/Suite")("CRU Order Detail Util");
const makeOrderDetailUtil = require("../../util/OrderDetailUtil.func");
const OrderDetailModel = use("App/Models/OrderDetail");

test("should return empty array of rows from makeOrderDetailUtil", async ({
  assert,
}) => {
  const testSubject = await makeOrderDetailUtil(OrderDetailModel).getAll("");

  assert.equal(testSubject.rows.length, 0);
});

test("should return object of created index from makeOrderDetailUtil.", async ({
  assert,
}) => {
  const testSubject = await makeOrderDetailUtil(OrderDetailModel).create({
    product_id: 1,
    order_quantity: 1,
    order_id: 1,
  });

  assert.isOk(testSubject);
});

test("should return array of row from makeOrderDetailUtil.", async ({
  assert,
}) => {
  const testSubject = await makeOrderDetailUtil(OrderDetailModel).getAll("");

  assert.isArray(testSubject.rows);
});

test("should return object of requested created index from makeOrderDetailUtil.", async ({
  assert,
}) => {
  const testSubject = await makeOrderDetailUtil(OrderDetailModel).getById(
    1,
    ""
  );

  assert.isOk(testSubject);
});

test("should return modified object of updated index form makeOrderDetailUtil.", async ({
  assert,
}) => {
  const testSubject = await makeOrderDetailUtil(OrderDetailModel).updateById(
    1,
    { order_quantity: 2 },
    ""
  );

  assert.equal(testSubject["$attributes"].order_quantity, 2);
});
