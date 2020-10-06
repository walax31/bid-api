"use strict";

const CredentialRating = use("App/Models/CredentialRating");
const Customer = use("App/Models/Customer");
const makeCredentialRatingUtil = require("../../../util/CredentialRatingUtil.func");
const makeCustomerUtil = require("../../../util/CustomerUtil.func");

class CredentialController {
  async index({ request }) {
    const { references, page, per_page } = request.qs;

    const { rows, pages } = await makeCredentialRatingUtil(
      CredentialRating
    ).getAll(references, page, per_page);

    return { status: 200, error: undefined, pages, data: rows };
  }

  async show({ request }) {
    const { params, qs } = request;

    const { id } = params;

    const { references } = qs;

    const credentialRating = await makeCredentialRatingUtil(
      CredentialRating
    ).getById(id, references);

    return { status: 200, error: undefined, data: credentialRating || {} };
  }

  async store({ request }) {
    const { body, qs } = request;

    const {
      customer_uuid,
      rating_score,
      rating_description,
      product_uuid,
    } = body;

    const { references } = qs;

    const credentialRating = await makeCredentialRatingUtil(
      CredentialRating
    ).create(
      {
        customer_uuid,
        rating_score,
        rating_description,
        product_uuid,
      },
      references
    );

    return {
      status: 200,
      error: undefined,
      data: credentialRating,
    };
  }

  async update({ request }) {
    const { body, params, qs } = request;

    const { id } = params;

    const { rating_score, rating_description } = body;

    const { references } = qs;

    const customerRating = await makeCustomerUtil(
      Customer
    ).ratingDoBelongToCustomer(request.customer_uuid, id);

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

  async destroy({ request }) {
    const { id } = request.params;

    switch (request.role) {
      case "admin":
        await makeCredentialRatingUtil(CredentialRating).deleteById(id);

        return {
          status: 200,
          error: undefined,
          data: "credentialRating is successfully removed.",
        };
      case "customer":
        const customerRating = await makeCustomerUtil(
          Customer
        ).ratingDoBelongToCustomer(request.customer_uuid, id);

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
      default:
    }
  }
}

module.exports = CredentialController;
