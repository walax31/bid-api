"use strict";

const { test, trait } = use("Test/Suite")("Oder Controller");
const OrderModel = use("App/Models/Order");
const UserModel = use("App/Models/User");
const CustomerModel = use("App/Models/Customer");
const ProductModel = use("App/Models/Product");
const makeUserUtil = require("../../util/testerUtil/autogenUserInstance.func");
const makeCustomerUtil = require("../../util/testerUtil/autogenCustomerInstance.func");
const makeProductUtil = require("../../util/testerUtil/autogenProductInstance.func");
const makeOrderUtil = require("../../util/testerUtil/autogenOrderInstance.func");
trait("Test/ApiClient");

const urlEndPoint = "/api/v1/orders";

test("should return structured response with empty data array via get method.", async ({
  client,
}) => {
  const response = await client.get(urlEndPoint).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: [],
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

test("should return error message and status code of 422 when field data is missing.", async ({
  client,
}) => {
  const { user_id } = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id);

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  const order = {
    order_quantity:1
    ,product_id
  };

  const response = await client.post(urlEndPoint).send(order).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    status: 422,
  });

  await UserModel.find(user_id).then((response) => response.delete());
});

test("should return structured response with no references in an array via get method.", async ({
  client,
}) => {

  const {user_id}= await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel,user_id);

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  const order =await makeOrderUtil(OrderModel,customer_id,product_id)

  const response = await client.get(urlEndPoint).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: [order],
  });

  await UserModel.find(user_id).then((response) => response.delete());
});

test("should return structured response with references in an array via get method.", async ({
  client,
}) => {
  const {user_id}= await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel,user_id);

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  const order =await makeOrderUtil(OrderModel,customer_id,product_id)

  const response = await client
    .get(urlEndPoint)
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
});
  
test("should return structured response with no references via get method.", async ({
  client,
}) => {
  const { user_id } = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id);

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  const order =await makeOrderUtil(OrderModel,customer_id,product_id)

  const response = await client
    .get(`${urlEndPoint}/${order.order_id}`)
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: order,
  });

  await UserModel.find(user_id).then((response) => response.delete());
});

test("should return structured response with references via get method.", async ({
  client,
}) => {
  const { user_id } = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id);

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  const order =await makeOrderUtil(OrderModel,customer_id,product_id)

  const response = await client
    .get(`${urlEndPoint}/${order.order_id}`)
    .query({ references: "customer,product" })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: {
      customer: { customer_id: customer_id },
      product: { product_id: product_id },
    },
  });

  await UserModel.find(user_id).then((response) => response.delete());
});

test("should return structured data with no references via post method.", async ({
  client,
}) => {
  const { user_id } = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id);

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  const order ={
    customer_id
    ,product_id
    ,order_quantity:1
  }

  const response = await client.post(urlEndPoint).send(order).end();

  console.log
  response.assertStatus(200);
  response.assertJSONSubset({
    data: order,
  });

  await UserModel.find(user_id).then((response) => response.delete());
});


test("should return structured data with references via post method.", async ({
  client,
}) => {
  const { user_id } = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id);

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  const order ={
    customer_id
    ,product_id
    ,order_quantity:1
  }

  const response = await client
    .post(urlEndPoint)
    .send(order)
    .query({ references: "customer,product" })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: order,
  });

  await UserModel.find(user_id).then((response) => response.delete());
});

test("should return structured data with no references via put method.", async ({
  client,
}) => {
  const { user_id } = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id);

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  const order =await makeOrderUtil(OrderModel,customer_id,product_id)

  // const orderData ={

  //   order_quantity:1
  // }

  const response = await client
    .put(`${urlEndPoint}/${order.order_id}`)
    .send({ order_quantity:1 })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: { order_quantity:1 },
  });

  await UserModel.find(user_id).then((response) => response.delete());
});

test("should return structured data with references via put method.", async ({
  client,
}) => {
  const { user_id } = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id);

  const { product_id } = await makeProductUtil(ProductModel, customer_id);
  
  const order =await makeOrderUtil(OrderModel,customer_id,product_id)


  const response = await client
    .put(`${urlEndPoint}/${order.order_id}`)
    .send({order_quantity:1 })
    .query({ references: "customer,product" })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: { order_quantity:1 },
  });

  await UserModel.find(user_id).then((response) => response.delete());
});

test("should return data index via delete method.", async ({ client }) => {
  const { user_id } = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id);

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  const order =await makeOrderUtil(OrderModel,customer_id,product_id)
  
  const response = await client
    .delete(`${urlEndPoint}/${order.order_id}`)
    .end();

  response.assertStatus(200);

  await UserModel.find(user_id).then((response) => response.delete());
});


