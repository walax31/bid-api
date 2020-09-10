'use strict'

const { test,trait } = use('Test/Suite')('Product Controller')
const UserModel =use("App/Models/User")

trait("Test/ApiClient");

test("should return structured response with empty data array via get method.", async ({
  client,
}) => {
  const response = await client.get("api/v1/products").end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: [],
  });
});

test("should return structured response with empty data via get method.", async ({
  client,
}) => {
  const response = await client.get("api/v1/products/1").end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: {},
  });
});

test("should return structured data with no references via post method.", async ({
  client,
}) => {
  const ProductData = {
    customer_id:2,
    product_name:"waxcsfs",

  };

  const response = await client.post("api/v1/products").send(ProductData).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: productDeta,
  });
});

test("should return structured data with no references via put method.", async ({
  client,
}) => {
  const productDeta = {
    product_name:"ujk"
  };

  const response = await client.put("api/v1/products/1").send(productDeta).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: productDetas,
  });
});
