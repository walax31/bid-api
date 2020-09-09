"use strict";

const { test, trait } = use("Test/Suite")("OderDetail Controller");
const OrderDetailModel = use("App/Models/OrderDetail");

trait("Test/ApiClient");

test("should return structured response with empty data array via get method.", async ({
  client,
}) => {
  const response = await client.get("api/v1/orderDetails").end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: [],
  });
});

test("should return structured response with empty data via get method.", async ({
  client,
}) => {
  const response = await client.get("api/v1/orderDetails/1").end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: {},
  });
});

test("should return structured data with no references via post method.", async ({
  client,
}) => {
  const orderDetailData = {
    product_id: 1,
    order_quantity:3,
    order_id:3
    
  };

  const response = await client.post("api/v1/orderDetails").send(orderDetailData).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: orderDetailData,
  });
});

test("should return structured data with no references via put method.", async ({
  client,
}) => {
  const orderDetailData = {
    order_quantity: 1,
  };

  const response = await client.put("api/v1/orderDetails/1").send(orderDetailData).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: orderDetailData,
  });
});
