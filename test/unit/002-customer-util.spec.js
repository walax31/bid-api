"use strict";

const { test } = use("Test/Suite")("Customer Detail Util");
const CustomerModel = use("App/Models/Customer");
const UserModel = use("App/Models/User");
const makeUserUtil = require("../../util/testerUtil/autogenUserInstance.func");
const makeCustomerUtil = require("../../util/CustomerUtil.func");

const sessionData = {};

test("should return empty array of rows from makeCustomerUtil", async ({
  assert,
}) => {
  const customers = await makeCustomerUtil(CustomerModel).getAll("");

  assert.equal(customers.rows.length, 0);
});

test("should return object of created index from makeCustomerUtil.", async ({
  assert,
}) => {
  const { user_id } = await makeUserUtil(UserModel);

  const customer = await makeCustomerUtil(CustomerModel).create({
    user_id,
    first_name: "first_name",
    last_name: "last_name",
    address: "somerandomaddress",
    phone: "(000) 000-0000",
    path_to_credential: "path/to/credential",
  });

  const { customer_id } = customer["$attributes"];

  assert.isOk(customer_id);

  sessionData.customer_id = customer_id;
  sessionData.user_id = user_id;
});

test("should return array of row from makeCustomerUtil.", async ({
  assert,
}) => {
  const customers = await makeCustomerUtil(CustomerModel).getAll("");

  assert.isAbove(customers.rows.length, 0);
});

test("should return object of requested created index from makeCustomerUtil.", async ({
  assert,
}) => {
  const customer = await makeCustomerUtil(CustomerModel).getById(
    sessionData.customer_id,
    ""
  );

  assert.isOk(customer);
});

test("should return modified object of updated index form makeCustomerUtil.", async ({
  assert,
}) => {
  const customer = await makeCustomerUtil(CustomerModel).updateById(
    sessionData.customer_id,
    { first_name: "a_new_first_name" },
    ""
  );

  assert.equal(customer["$attributes"].first_name, "a_new_first_name");
});

test("should return index of deleted index from makeCustomerUtil.", async ({
  assert,
}) => {
  assert.plan(2);

  const deletedCustomer = await makeCustomerUtil(CustomerModel).deleteById(
    sessionData.customer_id
  );

  assert.isOk(deletedCustomer);

  const deletedUser = await UserModel.find(
    sessionData.user_id
  ).then((response) => response.delete());

  assert.isOk(deletedUser);
});

test("should not return object of requested index from makeCustomerUtil.", async ({
  assert,
}) => {
  const customer = await makeCustomerUtil(CustomerModel).getById(
    sessionData.customer_id,
    ""
  );

  assert.isNotOk(customer);
});
