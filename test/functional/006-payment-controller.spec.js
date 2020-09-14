"use strict";

const OrderModel = use("App/Models/Order");
const UserModel = use("App/Models/User");
const CustomerModel = use("App/Models/Customer");
const ProductModel = use("App/Models/Product");
const makeUserUtil = require("../../util/testerUtil/autogenUserInstance.func");
const makeCustomerUtil = require("../../util/testerUtil/autogenCustomerInstance.func");
const makeProductUtil = require("../../util/testerUtil/autogenProductInstance.func");
const makeOrderUtil = require("../../util/testerUtil/autogenOrderInstance.func");
const makePaymentUtil = require("../../util/testerUtil/autogenPaymentInstance.func");
const makeAdminUtil = require("../../util/testerUtil/autogenAdminInstance.func");
const PaymentModel = use("App/Models/Payment");

const { test, trait } = use("Test/Suite")("Payment Controller");

trait("Test/ApiClient");
trait("Auth/Client");

const urlEndPoint = "/api/v1/payments";

test("should return structured response with empty data array via get method.", async ({
  client,
}) => {
  const admin =await makeAdminUtil(UserModel)
  const response = await client
  .get(urlEndPoint)
  .loginVia(admin,"jwt").end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: [],
  });
  await UserModel.find(admin.user_id).then((response)=>response.delete())
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
  await UserModel.find(admin.user_id).then((response)=>response.delete())
});

test("should return error message and status code of 422 when field data is missing.", async ({
  client,
}) => {
  const user= await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel,user.user_id,true);

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  const {order} =await makeOrderUtil(OrderModel,customer_id,product_id)


  const payment = {
   method:"sada"
  };

  const response = await client
  .post(urlEndPoint)
  .loginVia(user,"jwt")
  .send(payment)
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
  const admin =await makeAdminUtil(UserModel)
  const user= await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel,user.user_id,true);

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  const {order_id} =await makeOrderUtil(OrderModel,customer_id,product_id)

  const payment =await makePaymentUtil(PaymentModel, order_id)


  const response = await client
  .get(urlEndPoint)
  .loginVia(admin,"jwt")
  .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: [payment],
  });

  await UserModel.find(user.user_id).then((response) => response.delete());
  await UserModel.find(admin.user_id).then((response)=>response.delete())
});

test("should return structured response with references in an array via get method.", async ({
  client,
}) => {
  
  const admin = await makeAdminUtil(UserModel);
  const user= await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel,user.user_id,true);

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  const {order_id} =await makeOrderUtil(OrderModel,customer_id,product_id)

  const payment =await makePaymentUtil(PaymentModel, order_id)

  const response = await client
    .get(urlEndPoint)
    .loginVia(admin,"jwt")
    .query({ references: "order" })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: [
      {
     order: {order_id:order_id}
      },
    ],
  });

  await UserModel.find(user.user_id).then((response) => response.delete());
  await UserModel.find(admin.user_id).then((response) => response.delete());
});

test("should return structured response with no references via get method.", async ({
  client,
}) => {
  const user= await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel,user.user_id,true);

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  const {order_id} =await makeOrderUtil(OrderModel,customer_id,product_id)

  const payment =await makePaymentUtil(PaymentModel, order_id)


  const response = await client
    .get(`${urlEndPoint}/${payment.order_id}`)
    .loginVia(user ,"jwt")
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: payment,
  });

  await UserModel.find(user.user_id).then((response) => response.delete());
});

test("should return structured response with references via get method.", async ({
  client,
}) => {
  const user= await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel,user.user_id,true);

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  const {order_id} =await makeOrderUtil(OrderModel,customer_id,product_id)

  const payment =await makePaymentUtil(PaymentModel, order_id)


  const response = await client
    .get(`${urlEndPoint}/${payment.order_id}`)
    .loginVia(user,"jwt")
    .query({ references: "order" })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: {
      order: {order_id:order_id}
    },
  });

  await UserModel.find(user.user_id).then((response) => response.delete());
});

test("should return structured data with no references via post method.", async ({
  client,
}) => {
  const user= await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel,user.user_id,true);

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  const {order_id} =await makeOrderUtil(OrderModel,customer_id,product_id)

  const payment={
    order_id:order_id,
    status:"pending",
    method:"sds",
    total:2000,
    product_id:product_id
  }

  const response = await client
  .post(urlEndPoint)
  .loginVia(user,"jwt").send(payment).end();
  

  response.assertStatus(200);
  response.assertJSONSubset({
    data: payment
  });

  await UserModel.find(user.user_id).then((response) => response.delete());
});

test("should return structured data with references via post method.", async ({
  client,
}) => {
  const user= await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel,user.user_id,true);

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  const {order_id} =await makeOrderUtil(OrderModel,customer_id,product_id)

  const payment={
    order_id:order_id,
    status:"pending",
    method:"sds",
    total:2000
  }

  const response = await client
    .post(urlEndPoint)
    .loginVia(user,"jwt")
    .send(payment)
    .query({ references: "order" })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: payment,
  });

  await UserModel.find(user.user_id).then((response) => response.delete());
});

test("should return structured data with no references via put method.", async ({
  client,
}) => {
  const user= await makeUserUtil(UserModel);
  const admin = await makeAdminUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel,user.user_id,true);

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  const {order_id} =await makeOrderUtil(OrderModel,customer_id,product_id)

  const payment =await makePaymentUtil(PaymentModel, order_id)

  const response = await client
    .put(`${urlEndPoint}/${payment.order_id}`)
    .loginVia(admin,"jwt")
    .send({ total: 1100 })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: { total: 1100 },
  });
  await UserModel.find(admin.user_id).then((response) => response.delete());
  await UserModel.find(user.user_id).then((response) => response.delete());
});

test("should return structured data with references via put method.", async ({
  client,
}) => {
  const user= await makeUserUtil(UserModel);
  const admin = await makeAdminUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel,user.user_id,true);

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  const {order_id} =await makeOrderUtil(OrderModel,customer_id,product_id)

  await makePaymentUtil(PaymentModel, order_id)

  const response = await client
    .put(`${urlEndPoint}/${order_id}`)
    .loginVia(admin,"jwt")
    .send({  total: 1100  })
    .query({ references: "order" })
    .end();
     
  

  response.assertStatus(200);
  response.assertJSONSubset({
    data: {  total: 1100  },
  });
  await UserModel.find(admin.user_id).then((response) => response.delete());
  await UserModel.find(user.user_id).then((response) => response.delete());
});

test("should return data index via delete method.", async ({ client }) => {
  const admin = await makeAdminUtil(UserModel);
  const {user_id}= await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel,user_id);

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  const {order_id} =await makeOrderUtil(OrderModel,customer_id,product_id)

  const payment =await makePaymentUtil(PaymentModel, order_id)

  const response = await client
    .delete(`${urlEndPoint}/${payment.order_id}`)
    .loginVia(admin, "jwt")
    .end();

  response.assertStatus(200);

  await UserModel.find(user_id).then((response) => response.delete());
  await UserModel.find(admin.user_id).then((response) => response.delete());
});
