"use strict";

const { test } = use("Test/Suite")("Bid Util");
const BidModel = use("App/Models/Bid");
const ProductModel = use("App/Models/Product");
const CustomerModel = use("App/Models/Customer");
const UserModel = use("App/Models/User");
const makeUserUtil = require("../../util/testerUtil/autogenUserInstance.func");
const makeCustomerUtil = require("../../util/testerUtil/autogenCustomerInstance.func");
const makeProductUtil = require("../../util/testerUtil/autogenProductInstance.func");
const makeBidUtil = require("../../util/BidUtil.func");

const sessionData = {};

test("should return empty array of rows from makeBidUtil", async ({
  assert,
}) => {
  const bids = await makeBidUtil(BidModel).getAll("");

  assert.equal(bids.rows.length, 0);
});

test("should return object of created index from makeBidUtil.", async ({
  assert,
}) => {
  const { user_id } = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id);

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  const bid = await makeBidUtil(BidModel).create({
    customer_id,
    bid_amount: 1100,
    product_id,
  });

  const { bid_id } = bid["$attributes"];

  assert.isOk(bid_id);

  sessionData.bid_id = bid_id;
  sessionData.user_id = user_id;
});

test("should return array of row from makeBidUtil.", async ({ assert }) => {
  const bids = await makeBidUtil(BidModel).getAll("");

  assert.isAbove(bids.rows.length, 0);
});

test("should return object of requested created index from makeBidUtil.", async ({
  assert,
}) => {
  const bid = await makeBidUtil(BidModel).getById(sessionData.bid_id, "");

  assert.isOk(bid);
});

test("should return modified object of updated index form makeBidUtil.", async ({
  assert,
}) => {
  const bid = await makeBidUtil(BidModel).updateById(
    sessionData.bid_id,
    { bid_amount: 1200 },
    ""
  );

  assert.equal(bid["$attributes"].bid_amount, 1200);
});

test("should return index of deleted index from makeBidUtil.", async ({
  assert,
}) => {
  assert.plan(2);

  const deletedBid = await makeBidUtil(BidModel).deleteById(sessionData.bid_id);

  assert.isOk(deletedBid);

  const deletedUser = await UserModel.find(
    sessionData.user_id
  ).then((response) => response.delete());

  assert.isOk(deletedUser);
});

test("should not return object of requested index from makeBidUtil.", async ({
  assert,
}) => {
  const bid = await makeBidUtil(BidModel).getById(sessionData.bid_id, "");

  assert.isNotOk(bid);
});
