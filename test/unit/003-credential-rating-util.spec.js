"use strict";

const { test } = use("Test/Suite")("Credential Rating Detail Util");
const CredentialRatingModel = use("App/Models/CredentialRating");
const CustomerModel = use("App/Models/Customer");
const UserModel = use("App/Models/User");
const makeUserUtil = require("../../util/testerUtil/autogenUserInstance.func");
const makeCustomerUtil = require("../../util/testerUtil/autogenCustomerInstance.func");
const makeCredentialRatingUtil = require("../../util/CredentialRatingUtil.func");

const sessionData = {};

test("should return empty array of rows from makeCredentialRatingUtil", async ({
  assert,
}) => {
  const credentialRatings = await makeCredentialRatingUtil(
    CredentialRatingModel
  ).getAll("");

  assert.equal(credentialRatings.rows.length, 0);
});

test("should return object of created index from makeCredentialRatingUtil.", async ({
  assert,
}) => {
  const { user_id } = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id);

  const credentialRating = await makeCredentialRatingUtil(
    CredentialRatingModel
  ).create({
    customer_id,
    rating_score: 100,
    rating_description: "someratingdescription",
  });

  const { credential_rating_id } = credentialRating["$attributes"];

  assert.isOk(credential_rating_id);

  sessionData.credential_rating_id = credential_rating_id;
  sessionData.user_id = user_id;
});

test("should return array of row from makeCredentialRatingUtil.", async ({
  assert,
}) => {
  const credentialRatings = await makeCredentialRatingUtil(
    CredentialRatingModel
  ).getAll("");

  assert.isAbove(credentialRatings.rows.length, 0);
});

test("should return object of requested created index from makeCredentialRatingUtil.", async ({
  assert,
}) => {
  const credentialRating = await makeCredentialRatingUtil(
    CredentialRatingModel
  ).getById(sessionData.credential_rating_id, "");

  assert.isOk(credentialRating);
});

test("should return modified object of updated index form makeCredentialRatingUtil.", async ({
  assert,
}) => {
  const credentialRating = await makeCredentialRatingUtil(
    CredentialRatingModel
  ).updateById(
    sessionData.credential_rating_id,
    { rating_description: "a_new_description" },
    ""
  );

  assert.equal(
    credentialRating["$attributes"].rating_description,
    "a_new_description"
  );
});

test("should return index of deleted index from makeCredentialRatingUtil.", async ({
  assert,
}) => {
  assert.plan(2);

  const deletedCredentialRating = await makeCredentialRatingUtil(
    CredentialRatingModel
  ).deleteById(sessionData.credential_rating_id);

  assert.isOk(deletedCredentialRating);

  const deletedUser = await UserModel.find(
    sessionData.user_id
  ).then((response) => response.delete());

  assert.isOk(deletedUser);
});

test("should not return object of requested index from makeCredentialRatingUtil.", async ({
  assert,
}) => {
  const credentialRating = await makeCredentialRatingUtil(
    CredentialRatingModel
  ).getById(sessionData.credential_rating_id, "");

  assert.isNotOk(credentialRating);
});
