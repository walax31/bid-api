"use strict";

const { test } = use("Test/Suite")("D Login Detail Util");
const makeUserUtil = require("../../util/UserUtil.func");
const UserModel = use("App/Models/User");

test("should return index of deleted index from makeUserUtil.", async ({
  assert,
}) => {
  const testSubject = await makeUserUtil(UserModel).deleteById(1);

  assert.isOk(testSubject);
});

test("should not return object of requested index from makeUserUtil.", async ({
  assert,
}) => {
  const testSubject = await makeUserUtil(UserModel).getById(1, "");

  assert.isNotOk(testSubject);
});
