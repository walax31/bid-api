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

const urlEndPoint = "/api/v1/products";
trait("Auth/Client");

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

  const customer = await makeCustomerUtil(CustomerModel, user.user_id, true);

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

  await UserModel.find(user.user_id).then((response) => response.delete());
});

test("should return structured response with no references in an array via get method.", async ({
  client,
}) => {
  const user = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user.user_id);

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  const response = await client.get(urlEndPoint).loginVia(user, "jwt").end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: [{ product_id }],
  });

  await UserModel.find(user.user_id).then((response) => response.delete());
});

test("should return structured response with references in an array via get method.", async ({
  client,
}) => {
  const user = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user.user_id);

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  const response = await client
    .get(urlEndPoint)
    .loginVia(user, "jwt")
    .query({ references: "customer" })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: [
      {
        customer: { customer_id: customer_id },
      },
    ],
  });

  await UserModel.find(user.user_id).then((response) => response.delete());
});

test("should return structured response with no references via get method.", async ({
  client,
}) => {
  const user = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user.user_id);

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  const response = await client
    .get(`${urlEndPoint}/${product_id}`)
    .loginVia(user, "jwt")
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: { product_id },
  });

  await UserModel.find(user.user_id).then((response) => response.delete());
});

test("should return structured response with references via get method.", async ({
  client,
}) => {
  const user = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user.user_id);

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  const response = await client
    .get(`${urlEndPoint}/${product_id}`)
    .loginVia(user, "jwt")
    .query({ references: "customer" })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: {
      customer: { customer_id: customer_id },
    },
  });

  await UserModel.find(user.user_id).then((response) => response.delete());
});

test("should return structured data with no references via post method.", async ({
  client,
}) => {
  const user = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(
    CustomerModel,
    user.user_id,
    true
  );

  const product = {
    customer_id: customer_id,
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

  await UserModel.find(user.user_id).then((response) => response.delete());
});

test("should return structured data with references via post method.", async ({
  client,
}) => {
  const user = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(
    CustomerModel,
    user.user_id,
    true
  );
  const product = {
    customer_id: customer_id,
    product_name: "sdsdas",
    stock: 3,
  };

  const response = await client
    .post(urlEndPoint)
    .loginVia(user)
    .send(product)
    .query({ references: "customer" })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: product,
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

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  const response = await client
    .put(`${urlEndPoint}/${product_id}`)
    .loginVia(user, "jwt")
    .send({ stock: 3 })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: { stock: 3 },
  });

  await UserModel.find(user.user_id).then((response) => response.delete());
});

test("should return structured data with references via put method.", async ({
  client,
}) => {
  const user = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user.user_id);

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  const response = await client
    .put(`${urlEndPoint}/${product_id}`)
    .loginVia(user, "jwt")
    .send({ stock: 3 })
    .query({ references: "customer" })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: { stock: 3 },
  });

  await UserModel.find(user.user_id).then((response) => response.delete());
});

test("should return data index via delete method.", async ({ client }) => {
  const user = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user.user_id);

  const product = await makeProductUtil(ProductModel, customer_id);

  const response = await client
    .delete(`${urlEndPoint}/${product.product_id}`)
    .loginVia(user, "jwt")
    .end();

  response.assertStatus(200);

  await UserModel.find(user.user_id).then((response) => response.delete());
});
