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

test("(INITIALIZE)should return id of user, customer, and product.", async ({
  assert,
}) => {
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

test("(GET)should return structured response with empty data array via get method.", async ({
  client,
}) => {
  const response = await client.get(urlEndPoint).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: [],
  });
});

test("(FAKER)should return bid data.", async ({ assert }) => {
  const bid = await BidModel.create({
    customer_id: sessionData.customer_id,
    bid_amount: 1100,
    product_id: sessionData.product_id,
  });

  assert.isOk(bid);

  sessionData.bid = bid["$attributes"];
});

test("(GET)should return structured response with no references in an array via get method.", async ({
  client,
}) => {
  const response = await client.get(urlEndPoint).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: [sessionData.bid],
  });
});

test("(GET/REFERENCES)should return structured response with references in an array via get method.", async ({
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

test("(GET)should return structured response with no references via get method.", async ({
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

test("(GET/REFERENCES)should return structured response with references via get method.", async ({
  client,
}) => {
  const response = await client
    .get(`${urlEndPoint}/${sessionData.bid.bid_id}`)
    .query({ references: "customer,product" })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: {
      customer: { customer_id: sessionData.customer_id },
      product: { product_id: sessionData.product_id },
    },
  });
});

test("(POST/ERROR)should return error message and status code of 422 when field data is missing.", async ({
  client,
}) => {
  const bidData = {
    customer_id: sessionData.customer_id,
    product_id: sessionData.product_id,
  };

  const response = await client.post(urlEndPoint).send(bidData).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    status: 422,
  });
});

test("(POST)should return structured data with no references via post method.", async ({
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

test("(POST/REFERENCES)should return structured data with references via post method.", async ({
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

test("(PUT)should return structured data with no references via put method.", async ({
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

test("(PUT/REFERENCES)should return structured data with references via put method.", async ({
  client,
}) => {
  const bidData = {
    customer_id: sessionData.customer_id,
    bid_amount: 1200,
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

test("(DELETE)should return data index via delete method.", async ({
  client,
}) => {
  const response = await client
    .delete(`${urlEndPoint}/${sessionData.bid.bid_id}`)
    .end();

  response.assertStatus(200);
});

test("(GET)should return structured response with empty data via get method.", async ({
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

test("(FINALIZE)should return index of deleted product, customer, and user.", async ({
  assert,
}) => {
  assert.plan(3);

  const product_id = await ProductModel.find(
    sessionData.product_id
  ).then((response) => response.delete());

  const customer_id = await CustomerModel.find(
    sessionData.customer_id
  ).then((response) => response.delete());

  const user_id = await UserModel.find(sessionData.user_id).then((response) =>
    response.delete()
  );

  assert.isOk(product_id);
  assert.isOk(customer_id);
  assert.isOk(user_id);
});
