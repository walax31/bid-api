"use strict";

const { test, trait } = use("Test/Suite")("Customer Controller");
const UserModel = use("App/Models/User");
const CustomerModel = use("App/Models/Customer");
const makeUserUtil = require("../../util/testerUtil/autogenUserInstance.func");
const makeCustomerUtil = require("../../util/testerUtil/autogenCustomerInstance.func");
const makeAdminUtil = require("../../util/testerUtil/autogenAdminInstance.func");

trait("Test/ApiClient");
trait("Auth/Client");

const urlEndPoint = "/api/v1/customers";

test("should return structured response with empty data array via get method.", async ({
  client,
}) => {
  const admin = await makeAdminUtil(UserModel);

  const response = await client.get(urlEndPoint).loginVia(admin, "jwt").end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: [],
  });

  await UserModel.find(admin.user_id).then((response) => response.delete());
});

test("should return structured response with empty data via get method.", async ({
  client,
}) => {
  const admin = await makeAdminUtil(UserModel);

  const response = await client
    .get(`${urlEndPoint}/1`)
    .loginVia(admin, "jwt")
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: {},
  });

  await UserModel.find(admin.user_id).then((response) => response.delete());
});

test("should return error message and status code of 422 when field data is missing.", async ({
  client,
}) => {
  const user = await makeUserUtil(UserModel);

  const customer = {
    first_name: "dasdad",
  };

  const response = await client
    .post(urlEndPoint)
    .loginVia(user, "jwt")
    .send(customer)
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    status: 422,
  });

  await UserModel.find(user.user_id).then((response) => response.delete());
});

test("should return structured response with no references in an array via get method.", async ({
  client,
}) => {
  const admin = await makeAdminUtil(UserModel);

  const { user_id } = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id);

  const response = await client.get(urlEndPoint).loginVia(admin, "jwt").end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: [{ customer_id }],
  });

  await UserModel.find(user_id).then((response) => response.delete());
  await UserModel.find(admin.user_id).then((response) => response.delete());
});

test("should return structured response with references in an array via get method.", async ({
  client,
}) => {
  const admin = await makeAdminUtil(UserModel);

  const { user_id } = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id);

  const response = await client
    .get(urlEndPoint)
    .loginVia(admin, "jwt")
    .query({ references: "user" })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: [{ customer_id, user: { user_id } }],
  });

  await UserModel.findOrFail(user_id).then((response) => response.delete());
  await UserModel.findOrFail(admin.user_id).then((response) =>response.delete()
  );
});

test("should return structured data with no references via post method.", async ({
  client,
}) => {
  const user = await makeUserUtil(UserModel);

  const customerData = {
    first_name: "sdaw",
    last_name: "dawdad",
    address: "sdaawdwadwa",
    phone: "0984242343",
    // path_to_credential: "ddadaa",
  };

  const response = await client
    .post(urlEndPoint)
    .loginVia(user, "jwt")
    .send(customerData)
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: customerData,
  });

  await UserModel.find(user.user_id).then((response) => response.delete());
});

test("should return structured data with references via post method.", async ({
  client,
}) => {
  const user = await makeUserUtil(UserModel);

  const customerData = {
    first_name: "sdaw",
    last_name: "dawdad",
    address: "sdaawdwadwa",
    phone: "0984242343",
    // path_to_credential: "ddadaa",
  };

  const response = await client
    .post(urlEndPoint)
    .loginVia(user, "jwt")
    .send(customerData)
    .query({ references: "user" })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: { user },
  });

  await UserModel.find(user.user_id).then((response) => response.delete());
});

test("should return structured data with no references via put method.", async ({
  client,
}) => {
  const user = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(
    CustomerModel,
    user.user_id,
    true
  );

  const customerData = {
    address: "sdaawdwadwa",
  };

  const response = await client
    .put(`${urlEndPoint}/${customer_id}`)
    .loginVia(user, "jwt")
    .send(customerData)
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: customerData,
  });
  await UserModel.find(user.user_id).then((response) => response.delete());
});

test("should return structured data with references via put method.", async ({
  client,
}) => {
  const user = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(
    CustomerModel,
    user.user_id,
    true
  );

  const customerData = {
    address: "sdaawdwadwa",
  };

  const response = await client
    .put(`${urlEndPoint}/${customer_id}`)
    .loginVia(user, "jwt")
    .send(customerData)
    .query({ references: "user" })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: customerData,
  });

  await UserModel.find(user.user_id).then((response) => response.delete());
});

test("should return data index via delete method.", async ({ client }) => {
  const admin = await makeAdminUtil(UserModel);

  const { user_id } = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id);

  const response = await client
    .delete(`${urlEndPoint}/${customer_id}`)
    .loginVia(admin, "jwt")
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({ status: 200 });

  await UserModel.find(user_id).then((response) => response.delete());
  await UserModel.find(admin.user_id).then((response) => response.delete());
});
