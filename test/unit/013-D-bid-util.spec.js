"use strict";

const { test } = use("Test/Suite")("D Bid Util");
const makeBidUtil = require("../../util/BidUtil.func");
const BidModel = use("App/Models/Bid");

test("should return index of deleted index from makeBidUtil.", async ({
  assert,
}) => {
  const testSubject = await makeBidUtil(BidModel).deleteById(1);

  assert.isOk(testSubject);
});

test("should not return object of requested index from makeBidUtil.", async ({
  assert,
}) => {
  const testSubject = await makeBidUtil(BidModel).getById(1, "");

  assert.isNotOk(testSubject);
});
