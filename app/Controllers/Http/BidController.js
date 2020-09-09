"use strict";

const bidValidator = require("../../../service/bidValidator");
const Bid = use("App/Models/Bid");
const makeBidUtil = require("../../../util/BidUtil.func");
const numberTypeParamValidator = require("../../../util/numberTypeParamValidator.func");

class BidController {
  async index({ request }) {
    const { references } = request.qs;

    const bids = await makeBidUtil(Bid).getAll(references);

    return { status: 200, error: undefined, data: bids };
  }

  async show({ request }) {
    const { params, qs } = request;

    const { id } = params;

    const { references } = qs;

    const validateValue = numberTypeParamValidator(id);

    if (validateValue.error)
      return { status: 500, error: validateValue.error, date: undefined };

    const bid = await makeBidUtil(Bid).getById(id, references);

    return { status: 200, error: undefined, data: bid || {} };
  }

  async store({ request }) {
    const { body, qs } = request;

    const { customer_id, bid_amount, product_id } = body;

    const { references } = qs;

    const validation = await bidValidator(request.body);

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

  async update({ request }) {
    const { body, params, qs } = request;

    const { id } = params;

    const { references } = qs;

    const { customer_id, bid_amount, product_id } = body;

    const bid = await makeBidUtil(Bid).updateById(
      id,
      { customer_id, bid_amount, product_id },
      references
    );

    return { status: 200, error: undefined, data: bid };
  }

  async destroy({ request }) {
    const { id } = request.params;

    const bid = await makeBidUtil(Bid).deleteById(id);

    return {
      status: 200,
      error: undefined,
      data: { massage: `${bid} is successfully removed.` },
    };
  }
}

module.exports = BidController;
