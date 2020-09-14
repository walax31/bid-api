"use strict";

const { test, trait } = use("Test/Suite")("Credential Controller");
const UserModel = use("App/Models/User");
const makeTestUserUtil = require("../../util/testerUtil/autogenUserInstance.func");
const TokenModel = use("App/Models/Token");

trait("Test/ApiClient");
trait("Auth/Client");

test("should return token upon login.", async ({ client }) => {
  const { username, user_id } = await makeTestUserUtil(UserModel);

  const response = await client
    .post("/api/v1/login")
    .send({ username, password: "password" })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    error: undefined,
  });

  await UserModel.find(user_id).then((response) => response.delete());
});

test("should be able to perform authenticated action.", async ({ client }) => {
  const { username, user_id } = await makeTestUserUtil(UserModel);

  const response = await client
    .post("/api/v1/login")
    .send({ username, password: "password" })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    error: undefined,
  });

  await UserModel.find(user_id).then((response) => response.delete());
});

test("should return a new pair of tokens.", async ({ client }) => {
  const { username, user_id } = await makeTestUserUtil(UserModel);

  const response = await client
    .post("/api/v1/login")
    .send({ username, password: "password" })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    error: undefined,
  });

  const nextResponse = await client
    .post("/api/v1/authenticate")
    .header("refresh_token", response.body.data.refreshToken)
    .end();

  nextResponse.assertStatus(200);
  nextResponse.assertJSONSubset({
    error: undefined,
  });

  await UserModel.find(user_id).then((response) => response.delete());
});

test("should be able to logout.", async ({ client, assert }) => {
  const { username, user_id } = await makeTestUserUtil(UserModel);

  const response = await client
    .post("/api/v1/login")
    .send({ username, password: "password" })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    error: undefined,
  });

  const nextResponse = await client
    .post("/api/v1/logout")
    .header("refresh_token", response.body.data.refreshToken)
    .end();

  nextResponse.assertStatus(200);
  nextResponse.assertJSONSubset({
    error: undefined,
  });

  const { is_revoked } = await TokenModel.all().then(
    (response) => response.first()["$attributes"]
  );

  assert.equal(is_revoked, 1);

  await UserModel.find(user_id).then((response) => response.delete());
});
