"use strict";

const { test, trait } = use("Test/Suite")("Bid Controller endpoint testing");
// Models dependencies
const ProductDetailModel = use("App/Models/ProductDetail");
const BidModel = use("App/Models/Bid");
const UserModel = use("App/Models/User");
const CustomerModel = use("App/Models/Customer");
const ProductModel = use("App/Models/Product");
const makeUserUtil = require("../../util/testerUtil/autogenUserInstance.func");
const makeCustomerUtil = require("../../util/testerUtil/autogenCustomerInstance.func");
const makeProductUtil = require("../../util/testerUtil/autogenProductInstance.func");
const makeProductDetailUtil = require("../../util/testerUtil/autogenProductDetailInstance.func");
const makeAdminUtil = require("../../util/testerUtil/autogenAdminInstance.func");

trait("Test/ApiClient");
trait("Auth/Client");

const urlEndPoint = "/api/v1/bids";

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

  const customer = await makeCustomerUtil(CustomerModel, user.uuid, true);

  const product = await makeProductUtil(ProductModel, customer.uuid);

  const bid = {
    customer_uuid: customer.uuid,
    product_uuid: product.uuid,
  };

  const response = await client
    .post(urlEndPoint)
    .loginVia(user, "jwt")
    .send(bid)
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
  const admin = await makeAdminUtil(UserModel);

  const user = await makeUserUtil(UserModel);

  const customer = await makeCustomerUtil(CustomerModel, user.uuid);

  const product = await makeProductUtil(ProductModel, customer.uuid);

  const bid = await BidModel.create({
    customer_uuid: customer.uuid,
    bid_amount: 1000,
    product_uuid: product.uuid,
  });

  const response = await client.get(urlEndPoint).loginVia(admin, "jwt").end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: [bid.toJSON()],
  });

  await UserModel.find(admin.uuid).then((response) => response.delete());
  await UserModel.find(user.uuid).then((response) => response.delete());
});

test("should return structured response with references in an array via get method.", async ({
  client,
}) => {
  const admin = await makeAdminUtil(UserModel);

  const user = await makeUserUtil(UserModel);

  const customer = await makeCustomerUtil(CustomerModel, user.uuid);

  const product = await makeProductUtil(ProductModel, customer.uuid);

  await BidModel.create({
    customer_uuid: customer.uuid,
    bid_amount: 1000,
    product_uuid: product.uuid,
  });

  const response = await client
    .get(urlEndPoint)
    .loginVia(admin, "jwt")
    .query({ references: "customer,product" })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: [
      {
        customer: { uuid: customer.uuid },
        product: { uuid: product.uuid },
      },
    ],
  });

  await UserModel.find(user.uuid).then((response) => response.delete());
  await UserModel.find(admin.uuid).then((response) => response.delete());
});

test("should return structured response with no references via get method.", async ({
  client,
}) => {
  const user = await makeUserUtil(UserModel);

  const customer = await makeCustomerUtil(CustomerModel, user.uuid, true);

  const product = await makeProductUtil(ProductModel, customer.uuid);

  const bid = await BidModel.create({
    customer_uuid: customer.uuid,
    bid_amount: 2000,
    product_uuid: product.uuid,
  });

  const response = await client
    .get(`${urlEndPoint}/${bid.toJSON().uuid}`)
    .loginVia(user, "jwt")
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: bid.toJSON(),
  });

  await UserModel.find(user.uuid).then((response) => response.delete());
});

test("should return structured response with references via get method.", async ({
  client,
}) => {
  const user = await makeUserUtil(UserModel);

  const customer = await makeCustomerUtil(CustomerModel, user.uuid, true);

  const product = await makeProductUtil(ProductModel, customer.uuid);

  const bid = await BidModel.create({
    customer_uuid: customer.uuid,
    bid_amount: 1000,
    product_uuid: product.uuid,
  });

  const response = await client
    .get(`${urlEndPoint}/${bid.toJSON().uuid}`)
    .loginVia(user, "jwt")
    .query({ references: "customer,product" })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: {
      customer: { uuid: customer.uuid },
      product: { uuid: product.uuid },
    },
  });

  await UserModel.find(user.uuid).then((response) => response.delete());
});

test("should return structured data with no references via post method.", async ({
  client,
}) => {
  const user = await makeUserUtil(UserModel);

  const customer = await makeCustomerUtil(CustomerModel, user.uuid, true);

  const product = await makeProductUtil(ProductModel, customer.uuid);

  const productDetail = await makeProductDetailUtil(
    ProductDetailModel,
    product.uuid
  );

  const bid = {
    customer_uuid: customer.uuid,
    bid_amount: 1100,
    product_uuid: product.uuid,
  };

  const response = await client
    .post(urlEndPoint)
    .loginVia(user, "jwt")
    .send(bid)
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: bid,
  });

  await UserModel.find(user.uuid).then((response) => response.delete());
});

test("should return structured data with references via post method.", async ({
  client,
}) => {
  const user = await makeUserUtil(UserModel);

  const customer = await makeCustomerUtil(CustomerModel, user.uuid, true);

  const product = await makeProductUtil(ProductModel, customer.uuid);

  const productDetail = await makeProductDetailUtil(
    ProductDetailModel,
    product.uuid
  );

  const bid = {
    customer_uuid: customer.uuid,
    bid_amount: 1100,
    product_uuid: product.uuid,
  };

  const response = await client
    .post(urlEndPoint)
    .loginVia(user, "jwt")
    .send(bid)
    .query({ references: "customer,product" })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: {
      customer: { uuid: customer.uuid },
      product: { uuid: product.uuid },
    },
  });

  await UserModel.find(user.uuid).then((response) => response.delete());
});

test("should return structured data with no references via put method.", async ({
  client,
}) => {
  const user = await makeUserUtil(UserModel);

  const admin = await makeAdminUtil(UserModel);

  const customer = await makeCustomerUtil(CustomerModel, user.uuid, true);

  const product = await makeProductUtil(ProductModel, customer.uuid);

  const productDetail = await makeProductDetailUtil(
    ProductDetailModel,
    product.uuid
  );

  const bid = await BidModel.create({
    customer_uuid: customer.uuid,
    bid_amount: 1000,
    product_uuid: product.uuid,
  });

  const response = await client
    .put(`${urlEndPoint}/${bid.toJSON().uuid}`)
    .loginVia(admin, "jwt")
    .send({ bid_amount: 1100 })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: { bid_amount: 1100 },
  });
  await UserModel.find(admin.uuid).then((response) => response.delete());
  await UserModel.find(user.uuid).then((response) => response.delete());
});

test("should return structured data with references via put method.", async ({
  client,
}) => {
  const admin = await makeAdminUtil(UserModel);

  const user = await makeUserUtil(UserModel);

  const customer = await makeCustomerUtil(CustomerModel, user.uuid, true);

  const product = await makeProductUtil(ProductModel, customer.uuid);

  const productDetail = await makeProductDetailUtil(
    ProductDetailModel,
    product.uuid
  );

  const bid = await BidModel.create({
    customer_uuid: customer.uuid,
    bid_amount: 1000,
    product_uuid: product.uuid,
  }).then((response) => response.toJSON());

  const response = await client
    .put(`${urlEndPoint}/${bid.uuid}`)
    .loginVia(admin, "jwt")
    .send({ bid_amount: 1100 })
    .query({ references: "customer,product" })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: {
      bid_amount: 1100,
      customer: { uuid: customer.uuid },
      product: { uuid: product.uuid },
    },
  });

  await UserModel.find(admin.uuid).then((response) => response.delete());
  await UserModel.find(user.uuid).then((response) => response.delete());
});

test("should return data index via delete method.", async ({ client }) => {
  const admin = await makeAdminUtil(UserModel);

  const user = await makeUserUtil(UserModel);

  const customer = await makeCustomerUtil(CustomerModel, user.uuid, true);

  const product = await makeProductUtil(ProductModel, customer.uuid);

  const productDetail = await makeProductDetailUtil(
    ProductDetailModel,
    product.uuid
  );

  const bid = await BidModel.create({
    customer_uuid: customer.uuid,
    bid_amount: 1000,
    product_uuid: product.uuid,
  });

  const response = await client
    .delete(`${urlEndPoint}/${bid.toJSON().uuid}`)
    .loginVia(admin, "jwt")
    .end();

  response.assertStatus(200);
  await UserModel.find(user.uuid).then((response) => response.delete());
  await UserModel.find(admin.uuid).then((response) => response.delete());
});
