"use strict";

const { test, trait } = use("Test/Suite")("Product Controller");

const OrderModel = use("App/Models/Order");
const UserModel = use("App/Models/User");
const CustomerModel = use("App/Models/Customer");
const ProductModel = use("App/Models/Product");
const ProductDetailModel = use("App/Models/ProductDetail");
const makeAdminUtil = require("../../util/testerUtil/autogenAdminInstance.func");
const makeOrderUtil = require("../../util/testerUtil/autogenOrderInstance.func");
const makeUserUtil = require("../../util/testerUtil/autogenUserInstance.func");
const makeCustomerUtil = require("../../util/testerUtil/autogenCustomerInstance.func");
const makeProductUtil = require("../../util/testerUtil/autogenProductInstance.func");
const makeProductDetailUtil = require("../../util/testerUtil/autogenProductDetailInstance.func");

trait("Test/ApiClient");
trait("Auth/Client");

const urlEndPoint = "/api/v1/productDetails";
test("should return structured response with empty data array via get method.", async ({
  client,
}) => {
  const admin = await makeAdminUtil(UserModel);
  const response = await client.get(urlEndPoint).end();

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

  const { product_id } = await makeProductUtil(
    ProductModel,
    customer.customer_id
  );

  const { order_id } = await makeOrderUtil(
    OrderModel,
    customer.customer_id,
    product_id
  );

  const productDetail = {
    product_price: 1000,
  };

  const response = await client
    .post(urlEndPoint)
    .loginVia(user, "jwt")
    .send(productDetail)
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

  const { customer_id } = await makeCustomerUtil(
    CustomerModel,
    user.user_id,
    true
  );

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  const { order_id } = await makeOrderUtil(OrderModel, customer_id, product_id);

  const productDetail = await makeProductDetailUtil(
    ProductDetailModel,
    product_id
  );

  const response = await client.get(urlEndPoint).loginVia(user, "jwt").end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: [productDetail],
  });

  await UserModel.find(user.user_id).then((response) => response.delete());
});

test("should return structured response with references in an array via get method.", async ({
  client,
}) => {
  const user = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(
    CustomerModel,
    user.user_id,
    true
  );

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  const order_id = await makeOrderUtil(OrderModel, customer_id, product_id);

  const productDetail = await makeProductDetailUtil(
    ProductDetailModel,
    product_id
  );

  const response = await client
    .get(urlEndPoint)
    .loginVia(user, "jwt")
    .query({ references: "product" })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: [
      {
        product: { product_id: product_id },
      },
    ],
  });

  await UserModel.find(user.user_id).then((response) => response.delete());
});

test("should return structured response with no references via get method.", async ({
  client,
}) => {
  const user = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(
    CustomerModel,
    user.user_id,
    true
  );

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  const { order_id } = await makeOrderUtil(OrderModel, customer_id, product_id);

  const productDetail = await makeProductDetailUtil(
    ProductDetailModel,
    product_id
  );

  const response = await client
    .get(`${urlEndPoint}/${productDetail.product_id}`)
    .loginVia(user, "jwt")
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: productDetail,
  });

  await UserModel.find(user.user_id).then((response) => response.delete());
});

test("should return structured response with references via get method.", async ({
  client,
}) => {
  const user = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user.user_id);

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  const { order_id } = await makeOrderUtil(OrderModel, customer_id, product_id);

  const productDetail = await makeProductDetailUtil(
    ProductDetailModel,
    product_id
  );

  const response = await client
    .get(`${urlEndPoint}/${productDetail.product_id}`)
    .loginVia(user, "jwt")
    .query({ references: "product" })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: {
      product: { product_id: product_id },
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

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  const { order_id } = await makeOrderUtil(OrderModel, customer_id, product_id);

  const productDetail = {
    product_id: product_id,
    product_price: 2123,
    product_bid_start: 232,
    product_bid_increment: 232,
    product_description: "df43442sffs",
  };

  const response = await client
    .post(urlEndPoint)
    .loginVia(user, "jwt")
    .send(productDetail)
    .end();
  response.assertStatus(200);
  response.assertJSONSubset({
    data: productDetail,
  });

  await UserModel.find(user.user_id).then((response) => response.delete());
});

test("should return structured data with references via post method.", async ({
  client,
}) => {
  const user = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user.user_id);

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  const { order_id } = await makeOrderUtil(OrderModel, customer_id, product_id);

  const productDetail = {
    product_id: product_id,
    product_price: 2123,
    product_bid_start: 232,
    product_bid_increment: 232,
    product_description: "df43442sffs",
  };

  const response = await client
    .post(urlEndPoint)
    .loginVia(user, "jwt")
    .send(productDetail)
    .query({ references: "product" })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: productDetail,
  });

  await UserModel.find(user.user_id).then((response) => response.delete());
});

test("should return structured data with no references via put method.", async ({
  client,
}) => {
  const admin = await makeAdminUtil(UserModel);
  const user = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(
    CustomerModel,
    user.user_id,
    true
  );

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  const { order_id } = await makeOrderUtil(OrderModel, customer_id, product_id);

  const productDetail = await makeProductDetailUtil(
    ProductDetailModel,
    product_id
  );

  const response = await client
    .put(`${urlEndPoint}/${productDetail.product_id}`)
    .loginVia(admin, "jwt")
    .send({ product_price: 2000 })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: { product_price: 2000 },
  });
  await UserModel.find(admin.user_id).then((response) => response.delete());
  await UserModel.find(user.user_id).then((response) => response.delete());
});

test("should return structured data with references via put method.", async ({
  client,
}) => {
  const admin = await makeAdminUtil(UserModel);
  const user = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(
    CustomerModel,
    user.user_id,
    true
  );

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  const { order_id } = await makeOrderUtil(OrderModel, customer_id, product_id);

  const productDetail = await makeProductDetailUtil(
    ProductDetailModel,
    product_id
  );

  const response = await client
    .put(`${urlEndPoint}/${product_id}`)
    .loginVia(admin, "jwt")
    .send({ product_price: 2000 })
    .query({ references: "product" })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: { product_price: 2000 },
  });
  await UserModel.find(admin.user_id).then((response) => response.delete());
  await UserModel.find(user.user_id).then((response) => response.delete());
});

test("should return data index via delete method.", async ({ client }) => {
  const admin = await makeAdminUtil(UserModel);
  const user = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user.user_id);

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  const { order_id } = await makeOrderUtil(OrderModel, customer_id, product_id);

  const productDetail = await makeProductDetailUtil(
    ProductDetailModel,
    product_id
  );

  const response = await client
    .delete(`${urlEndPoint}/${productDetail.product_id}`)
    .loginVia(admin, "jwt")
    .end();

  response.assertStatus(200);

  await UserModel.find(admin.user_id).then((response) => response.delete());
  await UserModel.find(user.user_id).then((response) => response.delete());
});
