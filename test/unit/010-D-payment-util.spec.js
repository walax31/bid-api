"use strict";

const { test } = use("Test/Suite")("D Payment Util");
const makePaymentUtil = require("../../util/PaymentUtil.func");
const PaymentModel = use("App/Models/Payment");

test("should return index of deleted index from makePaymentUtil.", async ({
  assert,
}) => {
  const testSubject = await makePaymentUtil(PaymentModel).deleteById(1);

  assert.isOk(testSubject);
});

test("should not return object of requested index from makePaymentUtil.", async ({
  assert,
}) => {
  const testSubject = await makePaymentUtil(PaymentModel).getById(1, "");

  assert.isNotOk(testSubject);
});
