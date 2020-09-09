"use strict";

const { test } = use("Test/Suite")("CRU Bid Util");
const makeBidUtil = require("../../util/BidUtil.func");
const BidModel = use("App/Models/Bid");

test("should return empty array of rows from makeBidUtil", async ({
  assert,
}) => {
  const testSubject = await makeBidUtil(BidModel).getAll("");

  assert.equal(testSubject.rows.length, 0);
});

test("should return object of created index from makeBidUtil.", async ({
  assert,
}) => {
  const testSubject = await makeBidUtil(BidModel).create({
    customer_id: 1,
    bid_amount: 1100,
    product_id: 1,
  });

  assert.isOk(testSubject);
});

test("should return array of row from makeBidUtil.", async ({ assert }) => {
  const testSubject = await makeBidUtil(BidModel).getAll("");

  assert.isArray(testSubject.rows);
});

test("should return object of requested created index from makeBidUtil.", async ({
  assert,
}) => {
  const testSubject = await makeBidUtil(BidModel).getById(1, "");

  assert.isOk(testSubject);
});

test("should return modified object of updated index form makeBidUtil.", async ({
  assert,
}) => {
  const testSubject = await makeBidUtil(BidModel).updateById(
    1,
    { bid_amount: 1200 },
    ""
  );

  assert.equal(testSubject["$attributes"].bid_amount, 1200);
});
