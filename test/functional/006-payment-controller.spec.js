"use strict";

const { test, trait } = use("Test/Suite")("Payment Controller");
const PaymentModel = use("App/Models/Payment");

trait("Test/ApiClient");

test("should return structured response with empty data array via get method.", async ({
  client,
}) => {
  const response = await client.get("api/v1/payments").end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: [],
  });
});

test("should return structured response with empty data via get method.", async ({
  client,
}) => {
  const response = await client.get("api/v1/payments/1").end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: {},
  });
});

test("should return structured data with no references via post method.", async ({
  client,
}) => {
  const paymentData = {
    method: "rfeedaw",
    status: "eded",
    total: 1,
  };

  const response = await client.post("api/v1/payments").send(paymentData).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: paymentData,
  });
});

test("should return structured data with no references via put method.", async ({
  client,
}) => {
  const paymentData = {
    status: "dsfdsfsf",
  };

  const response = await client.put("api/v1/payments/1").send(paymentData).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: paymentData,
  });
});
