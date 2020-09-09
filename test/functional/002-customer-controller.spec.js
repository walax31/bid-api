'use strict'

const { test,trait } = use('Test/Suite')('Customer Controller')
const CustomerModel = use("App/Models/Customer");

trait("Test/ApiClient")

test("should return structured response with empty data array via get method.", async ({
  client,
}) => {
  const response = await client.get("api/v1/customers").end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: [],
  });
});

test("should return structured response with empty data via get method.", async ({
  client,
}) => {
  const response = await client.get("api/v1/customers/1").end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: {},
  });
});

test("should return structured data with no references via post method.", async ({
  client,
}) => {
  const customerData = {
    user_id: 1,
    first_name: "sdaw",
    last_name: "dawdad",
    address:"sdaawdwadwa",
    phone:"0984242343",
    path_to_credential:"ddadaa"
  };

  const response = await client.post("api/v1/customers").send(customerData).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: customerData,
  });
});

test("should return structured data with no references via put method.", async ({
  client,
}) => {
  const customerData = {
    address:"sdaawdwadwa",
  };

  const response = await client.put("api/v1/customers/1").send(customerData).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: bidcustomerDataData,
  });
});
