"use strict";

const { test } = use("Test/Suite")("D Credential Rating Util");
const makeCredentialRatingUtil = require("../../util/CredentialRatingUtil.func");
const CredentialRatingModel = use("App/Models/CredentialRating");

test("should return index of deleted index from makeCredentialRatingUtil.", async ({
  assert,
}) => {
  const testSubject = await makeCredentialRatingUtil(
    CredentialRatingModel
  ).deleteById(1);

  assert.isOk(testSubject);
});

test("should not return object of requested index from makeCredentialRatingUtil.", async ({
  assert,
}) => {
  const testSubject = await makeCredentialRatingUtil(
    CredentialRatingModel
  ).getById(1, "");

  assert.isNotOk(testSubject);
});
