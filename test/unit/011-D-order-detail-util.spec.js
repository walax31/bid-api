"use strict";

const { test } = use("Test/Suite")("D Order Detail Util");
const makeOrderDetailUtil = require("../../util/OrderDetailUtil.func");
const OrderDetailModel = use("App/Models/OrderDetail");

test("should return index of deleted index from makeOrderDetailUtil.", async ({
  assert,
}) => {
  const testSubject = await makeOrderDetailUtil(OrderDetailModel).deleteById(1);

  assert.isOk(testSubject);
});

test("should not return object of requested index from makeOrderDetailUtil.", async ({
  assert,
}) => {
  const testSubject = await makeOrderDetailUtil(OrderDetailModel).getById(
    1,
    ""
  );

  assert.isNotOk(testSubject);
});
