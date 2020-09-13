"use strict";

const credentialRatingValidator = require("../../../service/credentialRatingValidator");
const CredentialRating = use("App/Models/CredentialRating");
const Customer = use("App/Models/Customer");
const makeCredentialRatingUtil = require("../../../util/CredentialRatingUtil.func");
const makeCustomerUtil = require("../../../util/CustomerUtil.func");
const numberTypeParamValidator = require("../../../util/numberTypeParamValidator.func");
const performAuthentication = require("../../../util/authenticate.func");

class CredentialController {
  async index({ auth, request }) {
    const { references, page, per_page } = request.qs;

    const { admin, error } = await performAuthentication(auth).validateAdmin();

    if (error)
      return {
        status: 403,
        error: "Access denied. authentication failed.",
        data: undefined,
      };

    if (admin) {
      const { rows, pages } = await makeCredentialRatingUtil(
        CredentialRating
      ).getAll(references, page, per_page);

      return { status: 200, error: undefined, pages, data: rows };
    }

    const { auth_id } = await performAuthentication(auth).validateIdParam();

    const validatedCredential = await makeCustomerUtil(
      Customer
    ).hasCredentialValidated(auth_id);

    if (!validatedCredential)
      return {
        status: 403,
        error: "Access denied. invalid credential.",
        data: undefined,
      };

    const { rows, pages } = await makeCredentialRatingUtil(
      CredentialRating
    ).getAll(references, page, per_page);

    return { status: 200, error: undefined, pages, data: rows };
  }

  async show({ auth, request }) {
    const { params, qs } = request;

    const { id } = params;

    const { references } = qs;

    const { admin, error } = await performAuthentication(auth).validateAdmin();

    if (error)
      return {
        status: 403,
        error: "Access denied. authentication failed.",
        data: undefined,
      };

    const validateValue = numberTypeParamValidator(id);

    if (validateValue.error)
      return { status: 500, error: validateValue.error, date: undefined };

    if (admin) {
      const credentialRating = await makeCredentialRatingUtil(
        CredentialRating
      ).getById(id, references);

      return { status: 200, error: undefined, data: credentialRating || {} };
    }

    const { auth_id } = await performAuthentication(auth).validateIdParam();

    const validatedCredential = await makeCustomerUtil(
      Customer
    ).hasCredentialValidated(auth_id);

    if (!validatedCredential)
      return {
        status: 403,
        error: "Access denied. invalid credential.",
        data: undefined,
      };

    const credentialRating = await makeCredentialRatingUtil(
      CredentialRating
    ).getById(id, references);

    return { status: 200, error: undefined, data: credentialRating || {} };
  }

  async store({ auth, request }) {
    const { body, qs } = request;

    const { customer_id, rating_score, rating_description, product_id } = body;

    const { references } = qs;

    const { admin, error } = await performAuthentication(auth).validateAdmin();

    if (error)
      return {
        status: 403,
        error: "Access denied. authentication failed.",
        data: undefined,
      };

    if (!admin)
      return {
        status: 403,
        error:
          "Access denied. this action is reserved for regular customer only.",
        data: undefined,
      };

    const { auth_id } = await performAuthentication(auth).validateIdParam();

    const validatedCredential = await makeCustomerUtil(
      Customer
    ).hasCredentialValidated(auth_id);

    if (!validatedCredential)
      return {
        status: 403,
        error: "Access denied. invalid credential.",
        data: undefined,
      };

    const validation = await credentialRatingValidator(body);

    if (validation.error) {
      return {
        status: 422,
        error: validation.error,
        data: undefined,
      };
    }

    const credentialRating = await makeCredentialRatingUtil(
      CredentialRating
    ).create(
      {
        customer_id,
        rating_score,
        rating_description,
        product_id,
      },
      references
    );

    return {
      status: 200,
      error: undefined,
      data: credentialRating,
    };
  }

  async update({ auth, request }) {
    const { body, params, qs } = request;

    const { id } = params;

    const { customer_id, rating_score, rating_description } = body;

    const { references } = qs;

    const { admin, error } = await performAuthentication(auth).validateAdmin();

    if (error)
      return {
        status: 403,
        error: "Access denied. authentication failed.",
        data: undefined,
      };

    if (admin)
      return {
        status: 403,
        error:
          "Access denied. this action is reserved for regular customer only.",
        data: undefined,
      };

    const validateValue = numberTypeParamValidator(id);

    if (validateValue.error)
      return { status: 500, error: validateValue.error, date: undefined };

    const { customer_id } = await performAuthentication(auth).validateIdParam();

    const customerRating = await makeCustomerUtil(
      Customer
    ).ratingDoBelongToCustomer(customer_id, id);

    if (!customerRating)
      return {
        status: 404,
        error:
          "CredentialRating not found. credential rating you are looking does not seem to exist.",
        data: undefined,
      };

    const credentialRating = await makeCredentialRatingUtil(
      CredentialRating
    ).updateById(id, { rating_score, rating_description }, references);

    return { status: 200, error: undefined, data: credentialRating };
  }

  async destroy({ auth, request }) {
    const { id } = request.params;

    const { admin, error } = await performAuthentication(auth).validateAdmin();

    if (error)
      return {
        status: 403,
        error: "Access denied. authentication failed.",
        data: undefined,
      };

    const validateValue = numberTypeParamValidator(id);

    if (validateValue.error)
      return { status: 500, error: validateValue.error, date: undefined };

    if (admin) {
      await makeCredentialRatingUtil(CredentialRating).deleteById(id);

      return {
        status: 200,
        error: undefined,
        data: "credentialRating is successfully removed.",
      };
    }

    const { customer_id } = await performAuthentication(auth).validateIdParam();

    const customerRating = await makeCustomerUtil(
      Customer
    ).ratingDoBelongToCustomer(customer_id, id);

    if (!customerRating)
      return {
        status: 404,
        error:
          "CredentialRating not found. credential rating you are looking does not seem to exist.",
        data: undefined,
      };

    await makeCredentialRatingUtil(CredentialRating).deleteById(id);

    return {
      status: 200,
      error: undefined,
      data: "credentialRating is successfully removed.",
    };
  }
}

module.exports = CredentialController;
