"use strict";

const credentialValidator = require("../../../service/credentialRatingValidator");
const Credential = use("App/Models/CredentialRating");
const makeCredentialUtil = require("../../../util/CredentialRatingUtil.func");
const numberTypeParamValidator = require("../../../util/numberTypeParamValidator.func");

class CredentialController {
  async index({ request }) {
    const { references } = request.qs;
    const credentials = await makeCredentialUtil(Credential).getAll(references);

    return { status: 200, error: undefined, data: credentials };
  }

  async show({ request }) {
    const { params, qs } = request;

    const { id } = params;

    const { references } = qs;

    const validateValue = numberTypeParamValidator(id);

    if (validateValue.error)
      return { status: 500, error: validateValue.error, date: undefined };

    const credential = await makeCredentialUtil(Credential).getById(
      id,
      references
    );
    return { status: 200, error: undefined, data: credential || {} };
  }

  async store({ request }) {
    const { body, qs } = request;

    const { customer_id, rating_score, rating_description } = body;

    const { references } = qs;

    const validation = await credentialValidator(request.body);

    if (validation.error) {
      return { status: 422, error: validation.error, data: undefined };
    }

    const credential = await makeCredentialUtil(Credential).create(
      { customer_id, rating_score, rating_description },
      references
    );
    return {
      status: 200,
      error: undefined,
      data: credential,
    };
  }
  async update({ request }) {
    const { body, params, qs } = request;

    const { id } = params;

    const { references } = qs;
    const { customer_id, rating_score, rating_description } = body;

    const credential = await makeCredentialUtil(Credential).updateById(
      id,
      { customer_id, rating_score, rating_description },
      references
    );

    return { status: 200, error: undefined, data: credential };
  }
  async destroy({ request }) {
    const { id } = request.params;

    const credential = await makeCredentialUtil(Credential).deleteById(id);

    return {
      status: 200,
      error: undefined,
      data: { massage: `${credential} is successfully removed.` },
    };
  }
}

module.exports = CredentialController;
