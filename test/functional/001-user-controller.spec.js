"use strict";

const { test, trait } = use("Test/Suite")("User Controller");
const UserModel = use("App/Models/User");
const makeUserUtil = require("../../util/testerUtil/autogenUserInstance.func");

trait("Test/ApiClient");

const urlEndPoint = "/api/v1/users";
test("should return structured response with empty data array via get method.", async ({
  client,
}) => {
  const response = await client.get(urlEndPoint).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: [],
  });
});

test("should return structured response with empty data via get method.", async ({
  client,
}) => {
  const response = await client.get(`${urlEndPoint}/1`).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: {},
  });
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
  const UserData = {
    username: "wala",
    email: "wala@gmail.com",
    password: "wwdw1234",
  };

  const response = await client.post(urlEndPoint).send(UserData).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    error: undefined,
  });

  await UserModel.find(response.body.data.user_id).then((response) =>
    response.delete()
  );
});

test("should return structured data with no references via put method.", async ({
  client,
}) => {
  const { user_id } = await makeUserUtil(UserModel);
  const userData = {
    email: "wala@email.com",
  };

  const response = await client
    .put(`${urlEndPoint}/${user_id}`)
    .send(userData)
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: userData,
  });
  await UserModel.find(user_id).then((response) => response.delete());
});

test("should return data index via delete method.", async ({ client }) => {
  const { user_id } = await makeUserUtil(UserModel);
  const response = await client.delete(`${urlEndPoint}/${user_id}`).end();

  response.assertStatus(200);
});

test("should return error message and status code of 422 when field data is missing.", async ({
  client,
}) => {
  const user = {
    username: "ddssf",
    password: "134567dfdfd",
  };

  const response = await client.post(urlEndPoint).send(user).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    status: 422,
  });
});

test("should return structured response with no references in an array via get method.", async ({
  client,
}) => {
  const user = await makeUserUtil(UserModel);

  const response = await client.get(urlEndPoint).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: [user],
  });

  await UserModel.find(user.user_id).then((response) => response.delete());
});

test("should return structured response with no references via get method.", async ({
  client,
}) => {
  const user = await makeUserUtil(UserModel);

  const response = await client.get(`${urlEndPoint}/${user.user_id}`).end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: user,
  });

  await UserModel.find(user.user_id).then((response) => response.delete());
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

  await UserModel.find(response.body.data.user_id).then((response) =>
    response.delete()
  );
});

test("should return structured data with no references via put method.", async ({
  client,
}) => {
  const { user_id } = await makeUserUtil(UserModel);

  const response = await client
    .put(`${urlEndPoint}/${user_id}`)
    .send({ username: "zzzz" })
    .end();

  response.assertStatus(200);
  response.assertJSONSubset({
    data: { username: "zzzz" },
  });

  await UserModel.find(user_id).then((response) => response.delete());

  test("should return data index via delete method.", async ({ client }) => {
    const { user_id } = await makeUserUtil(UserModel);

    const response = await client.delete(`${urlEndPoint}/${customer_id}`).end();

    response.assertStatus(200);

    await UserModel.find(user_id).then((response) => response.delete());
  });
});

test("should return data index via delete method.", async ({ client }) => {
  const { user_id } = await makeUserUtil(UserModel);

  const response = await client.delete(`${urlEndPoint}/${user_id}`).end();

  response.assertStatus(200);


});
