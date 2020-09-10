"use strict";

const { test } = use("Test/Suite")("Login Detail Util");
const makeUserUtil = require("../../util/UserUtil.func");
const UserModel = use("App/Models/User");
const Hash = use("Hash");

const sessionData = {};

test("should return empty array of rows from makeUserUtil", async ({
  assert,
}) => {
  const users = await makeUserUtil(UserModel).getAll("");

  assert.equal(users.rows.length, 0);
});

test("should return object of created index from makeUserUtil.", async ({
  assert,
}) => {
  const hashedPassword = await Hash.make("averygoodpassword");

  const user = await makeUserUtil(UserModel).create({
    username: "username",
    password: hashedPassword,
    email: "example@domain.host",
  });

  const { user_id } = user["$attributes"];

  assert.isOk(user_id);

  sessionData.user_id = user_id;
});

test("should return array of row from makeUserUtil.", async ({ assert }) => {
  const users = await makeUserUtil(UserModel).getAll("");

  assert.isAbove(users.rows.length, 0);
});

test("should return object of requested created index from makeUserUtil.", async ({
  assert,
}) => {
  const user = await makeUserUtil(UserModel).getById(sessionData.user_id, "");

  assert.isOk(user);
});

test("should return modified object of updated index form makeUserUtil.", async ({
  assert,
}) => {
  const user = await makeUserUtil(UserModel).updateById(
    sessionData.user_id,
    { username: "a_new_username" },
    ""
  );

  assert.equal(user["$attributes"].username, "a_new_username");
});

test("should return index of deleted index from makeUserUtil.", async ({
  assert,
}) => {
  const deletedUser = await makeUserUtil(UserModel).deleteById(
    sessionData.user_id
  );

  assert.isOk(deletedUser);
});

test("should not return object of requested index from makeUserUtil.", async ({
  assert,
}) => {
  const user = await makeUserUtil(UserModel).getById(sessionData.user_id, "");

  assert.isNotOk(user);
});
