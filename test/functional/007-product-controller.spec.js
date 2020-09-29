"use strict";

const { test, trait } = use("Test/Suite")("Product Controller");

const UserModel = use("App/Models/User");
const CustomerModel = use("App/Models/Customer");
const ProductModel = use("App/Models/Product");
const makeUserUtil = require("../../util/testerUtil/autogenUserInstance.func");
const makeCustomerUtil = require("../../util/testerUtil/autogenCustomerInstance.func");
const makeProductUtil = require("../../util/testerUtil/autogenProductInstance.func");
const makeAdminUtil = require("../../util/testerUtil/autogenAdminInstance.func");

trait("Test/ApiClient");
trait("Auth/Client");

const urlEndPoint = "/api/v1/products";

test("should return structured response with empty data array via get method.", async ({
  client,
}) => {
  const admin = await makeAdminUtil(UserModel);

  const response = await client.get(urlEndPoint).loginVia(admin, "jwt").end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: [],
  });

  await UserModel.find(admin.uuid).then((response) => response.delete());
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

  await UserModel.find(admin.uuid).then((response) => response.delete());
});

test("should return error message and status code of 422 when field data is missing.", async ({
  client,
}) => {
  const user = await makeUserUtil(UserModel);

  await makeCustomerUtil(CustomerModel, user.uuid, true);

  const product = {
    stock: 1,
  };

  const response = await client
    .post(urlEndPoint)
    .loginVia(user, "jwt")
    .send(product)
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    status: 422,
  });

  await UserModel.find(user.uuid).then((response) => response.delete());
});

test("should return structured response with no references in an array via get method.", async ({
  client,
}) => {
  const user = await makeUserUtil(UserModel);

  const customer = await makeCustomerUtil(CustomerModel, user.uuid);

  const product = await makeProductUtil(ProductModel, customer.uuid);

  const response = await client.get(urlEndPoint).loginVia(user, "jwt").end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: [{ uuid: product.uuid }],
  });

  await UserModel.find(user.uuid).then((response) => response.delete());
});

test("should return structured response with references in an array via get method.", async ({
  client,
}) => {
  const user = await makeUserUtil(UserModel);

  const customer = await makeCustomerUtil(CustomerModel, user.uuid);

  const product = await makeProductUtil(ProductModel, customer.uuid);

  const response = await client
    .get(urlEndPoint)
    .loginVia(user, "jwt")
    .query({ references: "customer" })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: [
      {
        uuid: product.uuid,
        customer: { uuid: customer.uuid },
      },
    ],
  });

  await UserModel.find(user.uuid).then((response) => response.delete());
});

test("should return structured response with no references via get method.", async ({
  client,
}) => {
  const user = await makeUserUtil(UserModel);

  const customer = await makeCustomerUtil(CustomerModel, user.uuid);

  const product = await makeProductUtil(ProductModel, customer.uuid);

  const response = await client
    .get(`${urlEndPoint}/${product.uuid}`)
    .loginVia(user, "jwt")
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: { uuid: product.uuid },
  });

  await UserModel.find(user.uuid).then((response) => response.delete());
});

test("should return structured response with references via get method.", async ({
  client,
}) => {
  const user = await makeUserUtil(UserModel);

  const customer = await makeCustomerUtil(CustomerModel, user.uuid);

  const product = await makeProductUtil(ProductModel, customer.uuid);

  const response = await client
    .get(`${urlEndPoint}/${product.uuid}`)
    .loginVia(user, "jwt")
    .query({ references: "customer" })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: {
      uuid: product.uuid,
      customer: { uuid: customer.uuid },
    },
  });

  await UserModel.find(user.uuid).then((response) => response.delete());
});

test("should return structured data with no references via post method.", async ({
  client,
}) => {
  const user = await makeUserUtil(UserModel);

  const customer = await makeCustomerUtil(CustomerModel, user.uuid, true);

  const product = {
    customer_uuid: customer.uuid,
    product_name: "sdsdas",
    stock: 3,
  };

  const response = await client
    .post(urlEndPoint)
    .loginVia(user, "jwt")
    .send(product)
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: product,
  });

  await UserModel.find(user.uuid).then((response) => response.delete());
});

test("should return structured data with references via post method.", async ({
  client,
}) => {
  const user = await makeUserUtil(UserModel);

  const customer = await makeCustomerUtil(CustomerModel, user.uuid, true);

  const product = {
    customer_uuid: customer.uuid,
    product_name: "sdsdas",
    stock: 3,
  };

  const response = await client
    .post(urlEndPoint)
    .loginVia(user, "jwt")
    .send(product)
    .query({ references: "customer" })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: { uuid: response.body.data.uuid, customer: { uuid: customer.uuid } },
  });

  await UserModel.find(user.uuid).then((response) => response.delete());
});

test("should return structured data with no references via put method.", async ({
  client,
}) => {
  const user = await makeUserUtil(UserModel);

  const customer = await makeCustomerUtil(CustomerModel, user.uuid, true);

  const product = await makeProductUtil(ProductModel, customer.uuid);

  const response = await client
    .put(`${urlEndPoint}/${product.uuid}`)
    .loginVia(user, "jwt")
    .send({ stock: 3 })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: { stock: 3 },
  });

  await UserModel.find(user.uuid).then((response) => response.delete());
});

test("should return structured data with references via put method.", async ({
  client,
}) => {
  const user = await makeUserUtil(UserModel);

  const customer = await makeCustomerUtil(CustomerModel, user.uuid);

  const product = await makeProductUtil(ProductModel, customer.uuid);

  const response = await client
    .put(`${urlEndPoint}/${product.uuid}`)
    .loginVia(user, "jwt")
    .send({ stock: 3 })
    .query({ references: "customer" })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: { stock: 3, customer: { uuid: customer.uuid } },
  });

  await UserModel.find(user.uuid).then((response) => response.delete());
});

test("should return data index via delete method.", async ({ client }) => {
  const user = await makeUserUtil(UserModel);

  const customer = await makeCustomerUtil(CustomerModel, user.uuid);

  const product = await makeProductUtil(ProductModel, customer.uuid);

  const response = await client
    .delete(`${urlEndPoint}/${product.uuid}`)
    .loginVia(user, "jwt")
    .end();

  response.assertStatus(200);

  await UserModel.find(user.uuid).then((response) => response.delete());
});
