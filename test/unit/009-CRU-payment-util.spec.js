"use strict";

const { test } = use("Test/Suite")("CRU Payment Util");
const makePaymentUtil = require("../../util/PaymentUtil.func");
const PaymentModel = use("App/Models/Payment");

test("should return empty array of rows from makePaymentUtil", async ({
  assert,
}) => {
  const testSubject = await makePaymentUtil(PaymentModel).getAll("");

  assert.equal(testSubject.rows.length, 0);
});

test("should return object of created index from makePaymentUtil.", async ({
  assert,
}) => {
  const testSubject = await makePaymentUtil(PaymentModel).create({
    method: "banking",
    total: 2,
  });

  assert.isOk(testSubject);
});

test("should return array of row from makePaymentUtil.", async ({ assert }) => {
  const testSubject = await makePaymentUtil(PaymentModel).getAll("");

  assert.isArray(testSubject.rows);
});

test("should return object of requested created index from makePaymentUtil.", async ({
  assert,
}) => {
  const testSubject = await makePaymentUtil(PaymentModel).getById(1, "");

  assert.isOk(testSubject);
});

test("should return modified object of updated index form makePaymentUtil.", async ({
  assert,
}) => {
  const testSubject = await makePaymentUtil(PaymentModel).updateById(
    1,
    { status: "accepted" },
    ""
  );

  assert.equal(testSubject["$attributes"].status, "accepted");
});
