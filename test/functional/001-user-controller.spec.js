'use strict'

const { test,trait } = use('Test/Suite')('User Controller')
const UserModel =use("App/Models/User")

trait("Test/ApiClient");

test("should return structured response with empty data array via get method.", async ({
  client,
}) => {
  const response = await client.get("api/v1/users").end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: [],
  });
});

test("should return structured response with empty data via get method.", async ({
  client,
}) => {
  const response = await client.get("api/v1/users/1").end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: {},
  });
});

test("should return structured data with no references via post method.", async ({
  client,
}) => {
  const UserData = {
    username:"wala",
    email:"wala@gmail.com",
    password:"1234"
  };

  const response = await client.post("api/v1/users").send(UserData).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: userData,
  });
});

test("should return structured data with no references via put method.", async ({
  client,
}) => {
  const userData = {
    email:"wala@email.com"
  };

  const response = await client.put("api/v1/users/1").send(userData).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: userData,
  });
});
