"use strict";

const { test, trait } = use("Test/Suite")("User Controller");
const UserModel = use("App/Models/User");
const makeUserUtil = require("../../util/testerUtil/autogenUserInstance.func");
const makeAdminUtil = require("../../util/testerUtil/autogenAdminInstance.func");

trait("Test/ApiClient");
trait("Auth/Client");

const urlEndPoint = "/api/v1/users";

test("should return structured response with empty data array via get method.", async ({
  client,
}) => {
  const admin = await makeAdminUtil(UserModel);

  const response = await client.get(urlEndPoint).loginVia(admin, "jwt").end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: [],
  });

  await UserModel.find(admin.uuid).then((response) => response.delete());
});

test("should return structured response with empty data via get method.", async ({
  client,
}) => {
  const admin = await makeAdminUtil(UserModel);

  const response = await client
    .get(`${urlEndPoint}/1`)
    .loginVia(admin, "jwt")
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: {},
  });

  await UserModel.find(admin.uuid).then((response) => response.delete());
});

test("should return structured response with no references in an array via get method.", async ({
  client,
}) => {
  const admin = await makeAdminUtil(UserModel);

  const user = await makeUserUtil(UserModel);

  const response = await client.get(urlEndPoint).loginVia(admin, "jwt").end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: [{ uuid: user.uuid }],
  });

  await UserModel.find(admin.uuid).then((response) => response.delete());
  await UserModel.find(user.uuid).then((response) => response.delete());
});

test("should return structured response with no references via get method.", async ({
  client,
}) => {
  const user = await makeUserUtil(UserModel);

  const response = await client
    .get(`${urlEndPoint}/${user.uuid}`)
    .loginVia(user, "jwt")
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: { uuid: user.uuid },
  });

  await UserModel.find(user.uuid).then((response) => response.delete());
});

test("should return error message and status code of 422 when field data is missing.", async ({
  client,
}) => {
  const UserData = {
    username: "wala",
  };
  const response = await client.post(urlEndPoint).send(UserData).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    status: 422,
  });
});

test("should return structured data with no references via post method.", async ({
  client,
}) => {
  const user = {
    username: "wwww",
    email: "wadaw@gmail.coom",
    password: "ewewffff",
  };

  const response = await client.post(`${urlEndPoint}`).send(user).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    error: undefined,
  });

  await UserModel.find(response.body.data.uuid).then((response) =>
    response.delete()
  );
});

test("should return structured data with no references via put method.", async ({
  client,
}) => {
  const user = await makeUserUtil(UserModel);

  const userData = {
    email: "wala@email.com",
  };

  const response = await client
    .put(`${urlEndPoint}/${user.uuid}`)
    .loginVia(user, "jwt")
    .send(userData)
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    error: undefined,
  });

  await UserModel.find(user.uuid).then((response) => response.delete());
});

test("should return data index via delete method.", async ({ client }) => {
  const admin = await makeAdminUtil(UserModel);

  const { uuid } = await makeUserUtil(UserModel);

  const response = await client
    .delete(`${urlEndPoint}/${uuid}`)
    .loginVia(admin, "jwt")
    .end();

  response.assertStatus(200);

  await UserModel.find(admin.uuid).then((response) => response.delete());
});
