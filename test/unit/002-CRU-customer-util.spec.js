"use strict";

const { test } = use("Test/Suite")("CRU Customer Detail Util");
const makeCustomerUtil = require("../../util/CustomerUtil.func");
const CustomerModel = use("App/Models/Customer");

test("should return empty array of rows from makeCustomerUtil", async ({
  assert,
}) => {
  const testSubject = await makeCustomerUtil(CustomerModel).getAll("");

  assert.equal(testSubject.rows.length, 0);
});

test("should return object of created index from makeCustomerUtil.", async ({
  assert,
}) => {
  const testSubject = await makeCustomerUtil(CustomerModel).create({
    user_id: 1,
    first_name: "first_name",
    last_name: "last_name",
    address: "somerandomaddress",
    phone: "(000) 000-0000",
    path_to_credential: "path/to/credential",
  });

  assert.isOk(testSubject);
});

test("should return array of row from makeCustomerUtil.", async ({
  assert,
}) => {
  const testSubject = await makeCustomerUtil(CustomerModel).getAll("");

  assert.isArray(testSubject.rows);
});

test("should return object of requested created index from makeCustomerUtil.", async ({
  assert,
}) => {
  const testSubject = await makeCustomerUtil(CustomerModel).getById(1, "");

  assert.isOk(testSubject);
});

test("should return modified object of updated index form makeCustomerUtil.", async ({
  assert,
}) => {
  const testSubject = await makeCustomerUtil(CustomerModel).updateById(
    1,
    { first_name: "a_new_first_name" },
    ""
  );

  assert.equal(testSubject["$attributes"].first_name, "a_new_first_name");
});
