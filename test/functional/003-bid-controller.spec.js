"use strict";

const { test, trait } = use("Test/Suite")("Bid Controller");
const Hash = use("Hash");
// Models dependencies
const BidModel = use("App/Models/Bid");
const UserModel = use("App/Models/User");
const CustomerModel = use("App/Models/Customer");
const ProductModel = use("App/Models/Product");

const sessionData = {};

trait("Test/ApiClient");

const urlEndPoint = "/api/v1/bids";

test("should return id of user, customer, and product.", async ({ assert }) => {
  assert.plan(3);

  const user = await UserModel.create({
    username: "username",
    password: await Hash.make("password"),
    email: "example@domain.host",
  });

  const customer = await CustomerModel.create({
    user_id: user["$attributes"].user_id,
    first_name: "first_name",
    last_name: "last_name",
    address: "address",
    phone: "(000) 000-0000",
    path_to_credential: `path/to/credential/${user["$attributes"].user_id}`,
  });

  const product = await ProductModel.create({
    customer_id: customer["$attributes"].customer_id,
    product_name: "product_name",
    end_date: new Date(),
    stock: 10,
  });

  assert.isOk(user);
  assert.isOk(customer);
  assert.isOk(product);

  sessionData.user_id = user["$attributes"].user_id;
  sessionData.customer_id = customer["$attributes"].customer_id;
  sessionData.product_id = product["$attributes"].product_id;
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

test("should return bid data.", async ({ assert }) => {
  const bid = await BidModel.create({
    customer_id: sessionData.customer_id,
    bid_amount: 1100,
    product_id: sessionData.product_id,
  });

  assert.isOk(bid);

  sessionData.bid = bid["$attributes"];
});

test("should return structured response with no references in an array via get method.", async ({
  client,
}) => {
  const response = await client.get(urlEndPoint).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: [sessionData.bid],
  });
});

test("should return structured response with references in an array via get method.", async ({
  client,
}) => {
  const response = await client
    .get(urlEndPoint)
    .query({ references: "customer,product" })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: [
      {
        customer: { customer_id: sessionData.customer_id },
        product: { product_id: sessionData.product_id },
      },
    ],
  });
});

test("should return structured response with no references via get method.", async ({
  client,
}) => {
  const response = await client
    .get(`${urlEndPoint}/${sessionData.bid.bid_id}`)
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: sessionData.bid,
  });
});

test("should return structured response with no references via get method.", async ({
  client,
}) => {
  const response = await client
    .get(`${urlEndPoint}/${sessionData.bid.bid_id}`)
    .query({ references: "customer,product" })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: [
      {
        customer: { customer_id: sessionData.customer_id },
        product: { product_id: sessionData.product_id },
      },
    ],
  });
});

test("should return structured data with no references via post method.", async ({
  client,
}) => {
  const bidData = {
    customer_id: sessionData.customer_id,
    bid_amount: 1100,
    product_id: sessionData.product_id,
  };

  const response = await client.post(urlEndPoint).send(bidData).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: bidData,
  });
});

test("should return structured data with references via post method.", async ({
  client,
}) => {
  const bidData = {
    customer_id: sessionData.customer_id,
    bid_amount: 1100,
    product_id: sessionData.product_id,
  };

  const response = await client
    .post(urlEndPoint)
    .send(bidData)
    .query({ references: "customer,product" })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: bidData,
  });
});

test("should return structured data with no references via put method.", async ({
  client,
}) => {
  const bidData = {
    customer_id: sessionData.customer_id,
    bid_amount: 1100,
    product_id: sessionData.product_id,
  };

  const response = await client.post(urlEndPoint).send(bidData).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: bidData,
  });
});

test("should return structured data with references via put method.", async ({
  client,
}) => {
  const bidData = {
    customer_id: sessionData.customer_id,
    bid_amount: 1100,
    product_id: sessionData.product_id,
  };

  const response = await client
    .post(urlEndPoint)
    .send(bidData)
    .query({ references: "customer,product" })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: bidData,
  });
});

test("should return data index via delete method.", async ({ client }) => {
  const response = await client
    .delete(`${urlEndPoint}/${sessionData.bid.bid_id}`)
    .end();

  response.assertStatus(200);
});

test("should return structured response with empty data via get method.", async ({
  client,
}) => {
  const response = await client
    .get(`${urlEndPoint}/${sessionData.bid.bid_id}`)
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: {},
  });
});

test("should return index of deleted product, customer, and user.", async ({
  assert,
}) => {
  assert.plan(3);

  const product_id = await ProductModel.find(sessionData.product_id).delete();

  const customer_id = await CustomerModel.find(
    sessionData.customer_id
  ).delete();

  const user_id = await UserModel.find(sessionData.user_id).delete();

  assert.isOk(product_id);
  assert.isOk(customer_id);
  assert.isOk(user_id);
});
