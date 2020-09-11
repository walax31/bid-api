"use strict";

const { test, trait } = use("Test/Suite")("Customer Controller");
const UserModel = use("App/Models/User");
const CustomerModel = use("App/Models/Customer");
const makeUserUtil = require("../../util/testerUtil/autogenUserInstance.func");
const makeCustomerUtil = require("../../util/testerUtil/autogenCustomerInstance.func");

trait("Test/ApiClient");
const urlEndPoint = "/api/v1/customers";

test("should return structured response with empty data array via get method.", async ({
  client,
}) => {
  const response = await client.get(urlEndPoint).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: [],
  });
});
test("should return structured response with empty data array via get method.", async ({
  client,
}) => {
  const response = await client.get(urlEndPoint).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: [],
  });
});

test("should return error message and status code of 422 when field data is missing.", async ({
  client,
}) => {
  const customer = {
    first_name: "dasdad",
  };
  const response = await client.post(urlEndPoint).send(customer).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    status: 422,
  });
});

test("should return structured response with empty data via get method.", async ({
  client,
}) => {
  const response = await client.get(`${urlEndPoint}/1`).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: {},
  });
});

test("should return structured response with no references in an array via get method.", async ({
  client,
}) => {
  const { user_id } = await makeUserUtil(UserModel);

  const customer = await makeCustomerUtil(CustomerModel, user_id);

  const response = await client.get(urlEndPoint).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: [customer],
  });

  await UserModel.find(user_id).then((response) => response.delete());
});

test("should return structured data with no references via post method.", async ({
  client,
}) => {
  const { user_id } = await makeUserUtil(UserModel);
  const customerData = {
    user_id,
    first_name: "sdaw",
    last_name: "dawdad",
    address: "sdaawdwadwa",
    phone: "0984242343",
    path_to_credential: "ddadaa",
  };

  const response = await client.post(urlEndPoint).send(customerData).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: customerData,
  });
  await UserModel.find(user_id).then((response) => response.delete());
});

test("should return structured data with references via post method.", async ({
  client,
}) => {
  const { user_id } = await makeUserUtil(UserModel);

  const customerData = {
    user_id,
    first_name: "sdaw",
    last_name: "dawdad",
    address: "sdaawdwadwa",
    phone: "0984242343",
    path_to_credential: "ddadaa",
  };

  const response = await client
    .post(urlEndPoint)
    .send(customerData)
    .query({ references: "user" })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: customerData,
  });

  await UserModel.find(user_id).then((response) => response.delete());
});


test("should return structured data with no references via put method.", async ({
  client,
}) => {
  const { user_id } = await makeUserUtil(UserModel);
  
  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id);
  const customerData = {
    address: "sdaawdwadwa",
  };

  const response = await client
    .put(`${urlEndPoint}/${customer_id}`)
    .send(customerData)
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: customerData,
  });
  await UserModel.find(user_id).then((response) => response.delete());
});

test("should return structured data with references via put method.", async ({
  client,
}) => {
  const { user_id } = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id);
  
  const customerData = {
    address: "sdaawdwadwa",
  };


  const response = await client
    .put(`${urlEndPoint}/${customer_id}`)
    .send( customerData)
    .query({ references: "user" })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: customerData,
  });

  await UserModel.find(user_id).then((response) => response.delete());
});


test("should return data index via delete method.", async ({ client }) => {
  const { user_id } = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id);



  const response = await client
    .delete(`${urlEndPoint}/${customer_id}`)
    .end();

  response.assertStatus(200);

  await UserModel.find(user_id).then((response) => response.delete());
});

