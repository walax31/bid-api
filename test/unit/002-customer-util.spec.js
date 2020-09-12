"use strict";

const { test } = use("Test/Suite")("Customer Detail Util");
const CustomerModel = use("App/Models/Customer");
const UserModel = use("App/Models/User");
const makeUserUtil = require("../../util/testerUtil/autogenUserInstance.func");
const makeCustomerUtil = require("../../util/CustomerUtil.func");
const makeTestCustomerUtil = require("../../util/testerUtil/autogenCustomerInstance.func");

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

  const { customer_id } = await makeCustomerUtil(CustomerModel)
    .create({
      user_id,
      first_name: "first_name",
      last_name: "last_name",
      address: "somerandomaddress",
      phone: "(000) 000-0000",
      // path_to_credential: `path/to/credential/${user_id}`,
    })
    .then((response) => response["$attributes"]);

  assert.isOk(customer_id);

  await UserModel.find(user_id).then((response) => response.delete());
});

test("should return array of row from makeCustomerUtil.", async ({
  assert,
}) => {
  const { user_id } = await makeUserUtil(UserModel);

  await makeTestCustomerUtil(CustomerModel, user_id);

  const customers = await makeCustomerUtil(CustomerModel).getAll("");

  assert.isAbove(customers.rows.length, 0);

  await UserModel.find(user_id).then((response) => response.delete());
});

test("should return object of requested created index from makeCustomerUtil.", async ({
  assert,
}) => {
  const { user_id } = await makeUserUtil(UserModel);

  const { customer_id } = await makeTestCustomerUtil(CustomerModel, user_id);

  const customer = await makeCustomerUtil(CustomerModel).getById(
    customer_id,
    ""
  );

  assert.isOk(customer);

  await UserModel.find(user_id).then((response) => response.delete());
});

test("should return modified object of updated index form makeCustomerUtil.", async ({
  assert,
}) => {
  const { user_id } = await makeUserUtil(UserModel);

  const { customer_id } = await makeTestCustomerUtil(CustomerModel, user_id);

  const customer = await makeCustomerUtil(CustomerModel).updateById(
    customer_id,
    { first_name: "new_first_name" },
    ""
  );

  assert.equal(customer["$attributes"].first_name, "new_first_name");

  await UserModel.find(user_id).then((response) => response.delete());
});

test("should return index of deleted index from makeCustomerUtil.", async ({
  assert,
}) => {
  const { user_id } = await makeUserUtil(UserModel);

  const { customer_id } = await makeTestCustomerUtil(CustomerModel, user_id);

  const deletedCustomer = await makeCustomerUtil(CustomerModel).deleteById(
    customer_id
  );

  assert.isOk(deletedCustomer);

  await UserModel.find(user_id).then((response) => response.delete());
});
