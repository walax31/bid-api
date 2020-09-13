"use strict";

const { test, trait } = use("Test/Suite")("Bid Controller endpoint testing");
// Models dependencies
const BidModel = use("App/Models/Bid");
const UserModel = use("App/Models/User");
const CustomerModel = use("App/Models/Customer");
const ProductModel = use("App/Models/Product");
const makeUserUtil = require("../../util/testerUtil/autogenUserInstance.func");
const makeCustomerUtil = require("../../util/testerUtil/autogenCustomerInstance.func");
const makeProductUtil = require("../../util/testerUtil/autogenProductInstance.func");
const makeAdminUtil = require("../../util/testerUtil/autogenAdminInstance.func");

trait("Test/ApiClient");
trait("Auth/Client");


const urlEndPoint = "/api/v1/bids";

test("should return structured response with empty data array via get method.", async ({
  client,
}) => {

  const admin = await makeAdminUtil(UserModel);
  const response = await client.get(urlEndPoint).loginVia(admin,"jwt").end();
  
  response.assertStatus(200);
  response.assertJSONSubset({
    data: [],
  });
  await UserModel.find(admin.user_id).then((response) => response.delete());
});

test("should return structured response with empty data via get method.", async ({
  client,
}) => {
  const admin =await makeAdminUtil(UserModel)
  const response = await client
  .get(`${urlEndPoint}/1`)
  .loginVia(admin,"jwt")
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
  const { user_id } = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id);

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  const bid = {
    customer_id: customer_id,
    product_id: product_id,
  };

  const response = await client.post(urlEndPoint)
  .loginVia(admin,"jwt")
  .send(bid)
  .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    status: 422,
  });

  await UserModel.find(user_id).then((response) => response.delete());
});

test("should return structured response with no references in an array via get method.", async ({
  client,
}) => {
  const admin = await makeAdminUtil(UserModel);

  const { user_id } = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id);

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  const bid = await BidModel.create({
    customer_id,
    bid_amount: 1000,
    product_id,
  });

  const response = await client
  .get(urlEndPoint)
  .loginVia(admin,"jwt")
  .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: [bid["$attributes"]],
  });
  await UserModel.find(admin.user_id).then((response)=>response.delete())
  await UserModel.find(user_id).then((response) => response.delete());
});

test("should return structured response with references in an array via get method.", async ({
  client,
}) => {
  const admin =await makeAdminUtil(UserModel)
  const { user_id } = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id);

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  await BidModel.create({
    customer_id,
    bid_amount: 1000,
    product_id,
  });

  const response = await client
    .get(urlEndPoint)
    .loginVia(admin,"jwt")
    .query({ references: "customer,product" })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: [
      {
        customer: { customer_id: customer_id },
        product: { product_id: product_id },
      },
    ],
  });

  await UserModel.find(user_id).then((response) => response.delete());
  await UserModel.find(admin.user_id).then((response)=>response.delete())
});

test("should return structured response with no references via get method.", async ({
  client,
}) => {
  const admin =await makeAdminUtil(UserModel)

  const { user_id } = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id);

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  const bid = await BidModel.create({
    customer_id,
    bid_amount: 1000,
    product_id,
  });

  const response = await client
    .get(`${urlEndPoint}/${bid["$attributes"].bid_id}`)
    .loginVia(admin, "jwt")
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: bid["$attributes"],
  });
  await UserModel.find(admin.user_id).then((response)=>response.delete())
  await UserModel.find(user_id).then((response) => response.delete());
});

test("should return structured response with references via get method.", async ({
  client,
}) => {
  const admin =await makeAdminUtil(UserModel)
  const { user_id } = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id);

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  const bid = await BidModel.create({
    customer_id,
    bid_amount: 1000,
    product_id,
  });

  const response = await client
    .get(`${urlEndPoint}/${bid["$attributes"].bid_id}`)
    .loginVia(admin,"jwt")
    .query({ references: "customer,product" })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: {
      customer: { customer_id: customer_id },
      product: { product_id: product_id },
    },
  });
  await UserModel.find(admin.user_id).then((response)=>response.delete())
  await UserModel.find(user_id).then((response) => response.delete());
});

test("should return structured data with no references via post method.", async ({
  client,
}) => {
  
  const { user_id } = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id);

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  const bid = {
    customer_id: customer_id,
    bid_amount: 1100,
    product_id: product_id,
  };

  const response = await client.post(urlEndPoint)
  .send(bid).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: bid,
  });
  
  await UserModel.find(user_id).then((response) => response.delete());
});

test("should return structured data with references via post method.", async ({
  client,
}) => {
  
  
  const { user_id } = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id);

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  const bid = {
    customer_id: customer_id,
    bid_amount: 1100,
    product_id: product_id,
  };

  const response = await client
    .post(urlEndPoint)
    .send(bid)
    .query({ references: "customer,product" })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: bid,
  });

  await UserModel.find(user_id).then((response) => response.delete());
});

test("should return structured data with no references via put method.", async ({
  client,
}) => {
  const { user_id } = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id);

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  const bid = await BidModel.create({
    customer_id,
    bid_amount: 1000,
    product_id,
  });

  const response = await client
    .put(`${urlEndPoint}/${bid["$attributes"].bid_id}`)
    .send({ bid_amount: 1100 })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: { bid_amount: 1100 },
  });

  await UserModel.find(user_id).then((response) => response.delete());
});

test("should return structured data with references via put method.", async ({
  client,
}) => {
  const { user_id } = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id);

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  const {bid_id} = await BidModel.create({
    customer_id,
    bid_amount: 1000,
    product_id,
  }).then(response=>response["$attributes"]);

  const response = await client
    .put(`${urlEndPoint}/${bid_id}`)
    .send({ bid_amount: 1100 })
    .query({ references: "customer,product" })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: { bid_amount: 1100 },
  });

  await UserModel.find(user_id).then((response) => response.delete());
});

test("should return data index via delete method.", async ({ client }) => {
  const { user_id } = await makeUserUtil(UserModel);
  const admin = await makeAdminUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id);

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  const bid = await BidModel.create({
    customer_id,
    bid_amount: 1000,
    product_id,
  });

  const response = await client
    .delete(`${urlEndPoint}/${bid["$attributes"].bid_id}`)
    .loginVia(admin, "jwt")
    .end();

  response.assertStatus(200);

  await UserModel.find(admin.user_id).then((response) => response.delete());
});
