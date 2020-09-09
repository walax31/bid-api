"use strict";

const { test, trait } = use("Test/Suite")("Oder Controller");
const OrderModel = use("App/Models/Order");

trait("Test/ApiClient");

test("should return structured response with empty data array via get method.", async ({
  client,
}) => {
  const response = await client.get("api/v1/orders").end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: [],
  });
});

test("should return structured response with empty data via get method.", async ({
  client,
}) => {
  const response = await client.get("api/v1/orders/1").end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: {},
  });
});

test("should return structured data with no references via post method.", async ({
  client,
}) => {
  const orderData = {
    customer_id: 1,
    
  };

  const response = await client.post("api/v1/orders").send(orderData).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: orderData,
  });
});

test("should return structured data with no references via put method.", async ({
  client,
}) => {
  const orderData = {
    customer_id: 1,
  };

  const response = await client.put("api/v1/orders/1").send(orderData).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: orderData,
  });
});
