"use strict";
const Database = use(`Database`);
// const Validator = use("Validator");
const CredentialRating = use("App/Models/CredentialRating");
const makeCredentialRatingUtil = require("../../../util/CredentialRatingUtil.func");

function numberTypeParamValidator(number) {
  if (Number.isNaN(parseInt(number))) {
    return {
      error: `param:${number} is not supported,please use number type param intnstead`,
    };
  }
  return {};
}
class CredentialController {
  async index({ request }) {
    const { references = undefined } = request.qs;
    const credentialRating = await makeCredentialRatingUtil(
      CredentialRating
    ).getAll(references);

    return { status: 200, error: undefined, data: credentialRating };
  }

  async show({ request }) {
    const { id } = request.params;
    const { references } = request.qs;
    const validateValue = numberTypeParamValidator(id);
    if (validateValue.error)
      return { status: 500, error: validateValue.error, date: undefined };
    const bid = await makeCredentialRatingUtil(CredentialRating).getAll(
      references
    );
    return { status: 200, error: undefined, data: credentialRating || {} };
  }

  async store({ request }) {
    const { customer_id, rating_score, rating_description } = request.body;

    const rules = {
      customer_id: "required",
      rating_score: "required",
      rating_description: "required",
    };
    const CredentialRating = await makeCredentialRatingUtil(
      CredentialRating
    ).create({ customer_id, rating_score, rating_description }, rules);
    return {
      status: 200,
      error: undefined,
      data: customer_id,
      rating_score,
      rating_description,
    };
  }
  async update({ request }) {
    const { body, params } = request;
    const { id } = params;
    const { customer_id } = body;
    const { rating_score } = body;
    const { rating_description } = body;

    const credentialRatingID = await Database.table("credential_ratings")
      .where({ credential_rating_id: id })
      .update(customer_id, rating_score, rating_description);
    const credentialRating = await Database.table("credential_ratings")
      .where({ credential_ratings_id: credentialRatingID })
      .first();

    return { status: 200, error: undefined, data: credentialRating };
  }
  async destroy({ request }) {
    const { id } = request.params;
    await Database.table("credential_ratings")
      .where({ credential_rating_id: id })
      .delete();

    return { status: 200, error: undefined, data: { massage: "success" } };
  }
}

module.exports = CredentialController;
