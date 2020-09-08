"use strict";

const Database = use(`Database`);
const Validator = use("Validator");
const Bid = use("App/Models/Bid");
const makeBidUtil = require("../../../BidUtil.funct");

function numberTypeParamValidator(number) {
  if (Number.isNaN(parseInt(number))) {
    return {
      error: `param:${number} is not supported,please use number type param intnstead`,
    };
  }
  return {};
}

class BidController {
  async index({ request }) {
    const { references = undefined } = request.qs;
    const bid = await makeBidUtil(Bid).getAll(references);

    return { status: 200, error: undefined, data: bid };
  }

  async show({ request }) {
    const { id } = request.params;
    const { references } = request.qs;
    const validateValue = numberTypeParamValidator(id);
    if (validateValue.error)
      return { status: 500, error: validateValue.error, date: undefined };
    const bid = await makeBidUtil(Bid).getAll(references);
    return { status: 200, error: undefined, data: bid || {} };
  }

  async store({ request }) {
    const { customer_id, bid_amount, product_id } = request.body

    const rules = {
      customer_id: "required",
      bid_amount: "required",
      product_id: "required",
    };
    const bid = await makeBidUtil(Bid).create(
      { customer_id, bid_amount, product_id },
      rules
    );
    return {
      status: 200,
      error: undefined,
      data: customer_id,
      bid_amount,
      product_id,
    };
  }
  async update({ request }) {
    const { body, params } = request;
    const { id } = params;
    const { customer_id } = body;
    const { bid_amount } = body;
    const { product_id } = body;

    const bidID = await Database.table("bids")
      .where({ bid_id: id })
      .update(customer_id, bid_amount, product_id);
    const bid = await Database.table("bids").where({ bid_id: bidID }).first();

    return { status: 200, error: undefined, data: bid };
  }
  async destroy({ request }) {
    const { id } = request.params;
    await Database.table("bids").where({ bid_id: id }).delete();

    return { status: 200, error: undefined, data: { massage: "success" } };
  }
}

module.exports = BidController;
