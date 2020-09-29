"use strict";

const { test, trait } = use("Test/Suite")("Credential Controller");
const UserModel = use("App/Models/User");
const makeTestUserUtil = require("../../util/testerUtil/autogenUserInstance.func");
const TokenModel = use("App/Models/Token");

trait("Test/ApiClient");
trait("Auth/Client");

test("should return token upon login.", async ({ client, assert }) => {
  const { username, uuid } = await makeTestUserUtil(UserModel);

  const response = await client
    .post("/api/v1/login")
    .send({ username, password: "password" })
    .end();

  response.assertStatus(200);
  assert.isOk(response.body.data);

  await UserModel.find(uuid).then((response) => response.delete());
});

test("should be able to perform authenticated action.", async ({ client }) => {
  const user = await makeTestUserUtil(UserModel);

  const response = await client
    .get(`/api/v1/users/${user.uuid}`)
    .loginVia(user, "jwt")
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: { uuid: user.uuid },
  });

  await UserModel.find(user.uuid).then((response) => response.delete());
});

test("should return a new pair of tokens.", async ({ client, assert }) => {
  const { username, uuid } = await makeTestUserUtil(UserModel);

  const response = await client
    .post("/api/v1/login")
    .send({ username, password: "password" })
    .end();

  response.assertStatus(200);
  assert.isOk(response.body.data);

  const nextResponse = await client
    .post("/api/v1/authenticate")
    .header("refresh_token", response.body.data.refreshToken)
    .end();

  nextResponse.assertStatus(200);
  assert.isOk(nextResponse.body.data);

  await UserModel.find(uuid).then((response) => response.delete());
});

test("should be able to logout.", async ({ client, assert }) => {
  const { username, uuid } = await makeTestUserUtil(UserModel);

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

  const { is_revoked } = await TokenModel.all().then((response) =>
    response.first().toJSON()
  );

  assert.equal(is_revoked, 1);

  await UserModel.find(uuid).then((response) => response.delete());
});
