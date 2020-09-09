"use strict";

const { test } = use("Test/Suite")("D Customer Util");
const makeCustomerUtil = require("../../util/CustomerUtil.func");
const CustomerModel = use("App/Models/Customer");

test("should return index of deleted index from makeCustomerUtil.", async ({
  assert,
}) => {
  const testSubject = await makeCustomerUtil(CustomerModel).deleteById(1);

  assert.isOk(testSubject);
});

test("should not return object of requested index from makeCustomerUtil.", async ({
  assert,
}) => {
  const testSubject = await makeCustomerUtil(CustomerModel).getById(1, "");

  assert.isNotOk(testSubject);
});
