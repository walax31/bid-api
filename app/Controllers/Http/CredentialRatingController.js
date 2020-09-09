"use strict";

const credentialRatingValidator = require("../../../service/credentialRatingValidator");
const CredentialRating = use("App/Models/CredentialRating");
const makeCredentialRatingUtil = require("../../../util/CredentialRatingUtil.func");
const numberTypeParamValidator = require("../../../util/numberTypeParamValidator.func");

class CredentialController {
  async index({ request }) {
    const { references = undefined } = request.qs;

    const credentialRatings = await makeCredentialRatingUtil(
      CredentialRating
    ).getAll(references);

    return { status: 200, error: undefined, data: credentialRatings };
  }

  async show({ request }) {
    const { params, qs } = request;
    const { id } = params;

    const { references } = qs;

    const validateValue = numberTypeParamValidator(id);

    if (validateValue.error)
      return { status: 500, error: validateValue.error, date: undefined };

    const credentialRating = await makeCredentialRatingUtil(
      CredentialRating
    ).getAll(references);

    return { status: 200, error: undefined, data: credentialRating || {} };
  }

  async store({ request }) {
    const { body, qs } = request;

    const { customer_id, rating_score, rating_description } = body;

    const { references } = qs;

    const validation = await credentialRatingValidator(request.body);

    if (validation.error) {
      return {
        status: 422,
        error: validation.error,
        data: undefined,
      };
    }

    const credentialRating = await makeCredentialRatingUtil(
      CredentialRating
    ).create({ customer_id, rating_score, rating_description }, references);

    return {
      status: 200,
      error: undefined,
      data: credentialRating,
    };
  }

  async update({ request }) {
    const { body, params, qs } = request;

    const { id } = params;

    const { customer_id, rating_score, rating_description } = body;

    const { references } = qs;

    const credentialRating = await makeCredentialRatingUtil(
      CredentialRating
    ).updateById(
      id,
      { customer_id, rating_score, rating_description },
      references
    );

    return { status: 200, error: undefined, data: credentialRating };
  }

  async destroy({ request }) {
    const { id } = request.params;

    const credentialRating = await makeCredentialRatingUtil(
      CredentialRating
    ).deleteById(id);

    return {
      status: 200,
      error: undefined,
      data: { massage: `${credentialRating} is successfully removed.` },
    };
  }
}

module.exports = CredentialController;
