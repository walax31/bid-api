"use strict";

const { test } = use("Test/Suite")("Address Util");
const makeAddressUtil = require("../../util/addressUtil.func");
const AddressModel = use("App/Models/Address");

test("should return empty array of rows from makeAddressUtil.", async ({
  assert,
}) => {
  const customers = await makeAddressUtil(AddressModel).getAll("");

  assert.equal(customers.rows.length, 0);
});
