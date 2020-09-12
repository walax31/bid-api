"use strict";

const bidValidator = require("../../../service/bidValidator");
const Bid = use("App/Models/Bid");
const Customer = use("App/Models/Customer");
const makeBidUtil = require("../../../util/BidUtil.func");
const numberTypeParamValidator = require("../../../util/numberTypeParamValidator.func");
const performAuthentication = require("../../../util/authenticate.func");

class BidController {
  async index({ auth, request }) {
    const { references } = request.qs;

    const { admin, error } = await performAuthentication(auth).validateAdmin();

    if (error)
      return {
        status: 403,
        error,
        data: undefined,
      };

    if (admin) {
      const bids = await makeBidUtil(Bid).getAll(references);

      return { status: 200, error: undefined, data: bids };
    }

    const { customer_id } = await performAuthentication(auth).validateIdParam(
      Customer
    );

    if (!customer_id)
      return {
        status: 403,
        error: "Credential validation is required.",
        data: undefined,
      };

    const bids = await makeBidUtil(Bid).getAll(references, customer_id);

    return {
      status: 200,
      error: undefined,
      data: bids,
    };
  }

  async show({ auth, request }) {
    const { params, qs } = request;

    const { id } = params;

    const { references } = qs;

    const { admin, error } = await performAuthentication(auth).validateAdmin();

    if (error)
      return {
        status: 403,
        error,
        data: undefined,
      };

    const validateValue = numberTypeParamValidator(id);

    if (validateValue.error)
      return { status: 500, error: validateValue.error, date: undefined };

    if (admin) {
      const bid = await makeBidUtil(Bid).getById(id, references);

      return { status: 200, error: undefined, data: bid || {} };
    }

    const { customer_id } = await performAuthentication(auth).validateIdParam(
      Customer
    );

    if (customer_id === parseInt(id)) {
      const bid = await makeBidUtil(Bid).getById(customer_id, references);

      return { status: 200, error: undefined, data: bid || {} };
    }

    return {
      status: 200,
      error: "id param does not match credential id.",
      data: undefined,
    };
  }

  async store({ auth, request }) {
    const { body, qs } = request;

    const { bid_amount, product_id } = body;

    const { references } = qs;

    const { error } = await performAuthentication(auth).authenticate();

    if (error)
      return {
        status: 403,
        error,
        data: undefined,
      };

    const { customer_id } = await performAuthentication(auth).validateIdParam(
      Customer
    );

    const validation = await bidValidator({
      customer_id,
      bid_amount,
      product_id,
    });

    if (validation.error) {
      return { status: 422, error: validation.error, data: undefined };
    }

    const bid = await makeBidUtil(Bid).create(
      { customer_id, bid_amount, product_id },
      references
    );

    return {
      status: 200,
      error: undefined,
      data: bid,
    };
  }

  async update({ auth, request }) {
    const { body, params, qs } = request;

    const { id } = params;

    const { references } = qs;

    const { customer_id, bid_amount, product_id } = body;

    const { admin } = await performAuthentication(auth).validateAdmin();

    const validateValue = numberTypeParamValidator(id);

    if (validateValue.error)
      return { status: 500, error: validateValue.error, date: undefined };

    if (admin) {
      const bid = await makeBidUtil(Bid).updateById(
        id,
        { customer_id, bid_amount, product_id },
        references
      );

      return { status: 200, error: undefined, data: bid };
    }

    return {
      status: 200,
      error: "admin validation failed.",
      data: undefined,
    };
  }

  async destroy({ auth, request }) {
    const { id } = request.params;

    const { admin, error } = await performAuthentication(auth).validateAdmin();

    if (error)
      return {
        status: 403,
        error,
        data: undefined,
      };

    const validateValue = numberTypeParamValidator(id);

    if (validateValue.error)
      return { status: 500, error: validateValue.error, date: undefined };

    if (admin) {
      const bid = await makeBidUtil(Bid).deleteById(id);

      return {
        status: 200,
        error: undefined,
        data: { massage: "successfully removed index." },
      };
    }

    return {
      status: 200,
      error: "admin validation failed.",
      data: undefined,
    };
  }
}

module.exports = BidController;
