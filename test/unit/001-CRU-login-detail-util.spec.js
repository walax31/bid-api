"use strict";

const { test } = use("Test/Suite")("CRU Login Detail Util");
const makeUserUtil = require("../../util/UserUtil.func");
const UserModel = use("App/Models/User");
const Hash = use("Hash");

test("should return empty array of rows from makeUserUtil", async ({
  assert,
}) => {
  const testSubject = await makeUserUtil(UserModel).getAll("");

  assert.equal(testSubject.rows.length, 0);
});

test("should return object of created index from makeUserUtil.", async ({
  assert,
}) => {
  const hashedPassword = await Hash.make("averygoodpassword");

  const testSubject = await makeUserUtil(UserModel).create({
    username: "username",
    password: hashedPassword,
    email: "example@domain.host",
  });

  assert.isOk(testSubject);
});

test("should return array of row from makeUserUtil.", async ({ assert }) => {
  const testSubject = await makeUserUtil(UserModel).getAll("");

  assert.isArray(testSubject.rows);
});

test("should return object of requested created index from makeUserUtil.", async ({
  assert,
}) => {
  const testSubject = await makeUserUtil(UserModel).getById(1, "");

  assert.isOk(testSubject);
});

test("should return modified object of updated index form makeUserUtil.", async ({
  assert,
}) => {
  const testSubject = await makeUserUtil(UserModel).updateById(
    1,
    { username: "a_new_username" },
    ""
  );

  assert.equal(testSubject["$attributes"].username, "a_new_username");
});
