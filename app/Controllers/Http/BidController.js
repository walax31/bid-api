"use strict";

const bidValidator = require("../../../service/bidValidator");
const Bid = use("App/Models/Bid");
const Customer = use("App/Models/Customer");
const Product = use("App/Models/Product");
const makeCustomerUtil = require("../../../util/CustomerUtil.func");
const makeBidUtil = require("../../../util/BidUtil.func");
const makeProductUtil = require("../../../util/ProductUtil.func");
const numberTypeParamValidator = require("../../../util/numberTypeParamValidator.func");
const performAuthentication = require("../../../util/authenticate.func");

class BidController {
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
      const { rows, pages } = await makeBidUtil(Bid).getAll(
        references,
        page,
        per_page
      );

      return { status: 200, error: undefined, pages, data: rows };
    }

    const { customer_id } = await performAuthentication(auth).validateIdParam(
      Customer
    );

    if (!customer_id)
      return {
        status: 403,
        error: "Access denied. credential validation is missing.",
        data: undefined,
      };

    const { rows, pages } = await makeBidUtil(Bid).getAll(
      references,
      page,
      per_page,
      customer_id
    );

    return {
      status: 200,
      error: undefined,
      pages,
      data: rows,
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
        error: "Access denied. authentication failed.",
        data: undefined,
      };

    const validateValue = numberTypeParamValidator(id);

    if (validateValue.error)
      return { status: 422, error: validateValue.error, date: undefined };

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
      status: 403,
      error: "Access denied. id param does not match authentication id.",
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
        error: "Access denied. authentication failed.",
        data: undefined,
      };

    const { customer_id } = await performAuthentication(auth).validateIdParam(
      Customer
    );

    const validatedCredential = await makeCustomerUtil(
      Customer
    ).hasCredentialValidated(customer_id);

    if (!validatedCredential)
      return {
        status: 403,
        error: "Access denied. invalid credential.",
        data: undefined,
      };

    const validation = await bidValidator({
      customer_id,
      bid_amount,
      product_id,
    });

    if (validation.error) {
      return { status: 422, error: validation.error, data: undefined };
    }

    const existingBids = await makeProductUtil(
      Product
    ).findExistingBidOnThisProduct(product_id);

    if (existingBids.length) {
      const sortedBid = existingBids.sort(function (bid_one, bid_two) {
        if (bid_two) {
          return (
            bid_two["$attributes"].bid_amount -
            bid_one["$attributes"].bid_amount
          );
        }

        return 0 - bid_one["$attributes"].bid_amount;
      });

      console.log(sortedBid);

      const highestBid = sortedBid[0]["$attributes"].bid_amount;

      const { product_bid_increment } = await makeProductUtil(Product)
        .getById(product_id, "productDetail")
        .then(
          (response) => response.getRelated("productDetail")["$attributes"]
        );

      if (!product_bid_increment)
        return {
          status: 404,
          error:
            "Product not found. product you are looking for does not exist.",
          data: undefined,
        };

      if (bid_amount < highestBid + product_bid_increment)
        return {
          status: 422,
          error:
            "Requirement not met. your bid amount is lower than minimum bidable amount.",
        };

      const bid = await makeBidUtil(Bid).create(
        { customer_id, bid_amount, product_id },
        references
      );

      return {
        status: 200,
        error: undefined,
        data: bid,
      };
    } else {
      const { product_bid_start } = await makeProductUtil(Product)
        .getById(product_id, "productDetail")
        .then(
          (response) => response.getRelated("productDetail")["$attributes"]
        );

      if (!product_bid_start)
        return {
          status: 404,
          error:
            "Product not found. product you are looking for does not exist.",
          data: undefined,
        };

      if (bid_amount < product_bid_start)
        return {
          status: 422,
          error:
            "Requirement not met. your bid amount is lower than minimum starting point.",
          data: undefined,
        };

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
  }

  async update({ auth, request }) {
    const { body, params, qs } = request;

    const { id } = params;

    const { references } = qs;

    const { bid_amount } = body;

    const { admin } = await performAuthentication(auth).validateAdmin();

    const validateValue = numberTypeParamValidator(id);

    if (validateValue.error)
      return { status: 500, error: validateValue.error, date: undefined };

    if (admin) {
      const bid = await makeBidUtil(Bid).updateById(
        id,
        { bid_amount },
        references
      );

      return { status: 200, error: undefined, data: bid };
    }

    return {
      status: 403,
      error: "Access denied. admin validation failed.",
      data: undefined,
    };
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
      return { status: 422, error: validateValue.error, date: undefined };

    if (admin) {
      const bid = await makeBidUtil(Bid).deleteById(id);

      if (bid)
        return {
          status: 200,
          error: undefined,
          data: "successfully removed bid.",
        };

      return {
        status: 404,
        error: "Bid not found. bid you are looking for does not exist.",
        data: undefined,
      };
    }

    return {
      status: 403,
      error: "Access denied. admin validation failed.",
      data: undefined,
    };
  }
}

module.exports = BidController;
