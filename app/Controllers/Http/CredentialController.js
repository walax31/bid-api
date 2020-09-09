"use strict";

const Database = use(`Database`);
const Credential = use("App/Models/CredentialRating");
const makeCredentialUtil = require("../../../CredentialUtil.funct");

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
    const credential = await makeCredentialUtil(Credential).getAll(references);

    return { status: 200, error: undefined, data: credential };
  }

  async show({ request }) {
    const { id } = request.params;
    const { references } = request.qs;

    const validateValue = numberTypeParamValidator(id);
    if (validateValue.error)
      return { status: 500, error: validateValue.error, date: undefined };

    const credential = await makeCredentialUtil(Credential).getAll(references);
    return { status: 200, error: undefined, data: credential || {} };
  }

  async store({ request }) {
    const { customer_id, rating_score, rating_description } = request.body;

    const rules = {
      customer_id: "required",
      rating_score: "required",
      rating_description: "required",
    };
    const credential = await makeCredentialUtil(Credential).create(
      { customer_id, rating_score, rating_description },
      rules
    );
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

    const credentialID = await Database.table("credential_ratings")
      .where({ credential_rating_id: id })
      .update({ customer_id, rating_score, rating_description });
    const credential = await Database.table("credential_ratings")
      .where({ credential_rating_id: credentialID })
      .first();

    return { status: 200, error: undefined, data: credential };
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
