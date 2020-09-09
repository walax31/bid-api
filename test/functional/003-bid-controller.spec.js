"use strict";

const { test, trait } = use("Test/Suite")("Bid Controller");
const BidModel = use("App/Models/Bid");

trait("Test/ApiClient");

test("should return structured response with empty data array via get method.", async ({
  client,
}) => {
  const response = await client.get("/api/v1/bids").end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: [],
  });
});

test("should return structured response with empty data via get method.", async ({
  client,
}) => {
  const response = await client.get("api/v1/bids/1").end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: {},
  });
});

test("should return structured data with no references via post method.", async ({
  client,
}) => {
  const bidData = {
    customer_id: 1,
    bid_amount: 1000,
    product_id: 1,
  };

  const response = await client.post("api/v1/bids").send(bidData).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: bidData,
  });
});

test("should return structured data with no references via put method.", async ({
  client,
}) => {
  const bidData = {
    bid_amount: 1200,
  };

  const response = await client.put("api/v1/bids/1").send(bidData).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: bidData,
  });
});
