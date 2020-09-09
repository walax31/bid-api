"use strict";

const { test } = use("Test/Suite")("CRU Credential Rating Detail Util");
const makeCredentialRatingUtil = require("../../util/CredentialRatingUtil.func");
const CredentialRatingModel = use("App/Models/CredentialRating");

test("should return empty array of rows from makeCredentialRatingUtil", async ({
  assert,
}) => {
  const testSubject = await makeCredentialRatingUtil(
    CredentialRatingModel
  ).getAll("");

  assert.equal(testSubject.rows.length, 0);
});

test("should return object of created index from makeCredentialRatingUtil.", async ({
  assert,
}) => {
  const testSubject = await makeCredentialRatingUtil(
    CredentialRatingModel
  ).create({
    customer_id: 1,
    rating_score: 100,
    rating_description: "someratingdescription",
  });

  assert.isOk(testSubject);
});

test("should return array of row from makeCredentialRatingUtil.", async ({
  assert,
}) => {
  const testSubject = await makeCredentialRatingUtil(
    CredentialRatingModel
  ).getAll("");

  assert.isArray(testSubject.rows);
});

test("should return object of requested created index from makeCredentialRatingUtil.", async ({
  assert,
}) => {
  const testSubject = await makeCredentialRatingUtil(
    CredentialRatingModel
  ).getById(1, "");

  assert.isOk(testSubject);
});

test("should return modified object of updated index form makeCredentialRatingUtil.", async ({
  assert,
}) => {
  const testSubject = await makeCredentialRatingUtil(
    CredentialRatingModel
  ).updateById(1, { rating_description: "a_new_description" }, "");

  assert.equal(
    testSubject["$attributes"].rating_description,
    "a_new_description"
  );
});
