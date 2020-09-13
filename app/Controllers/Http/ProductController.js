"use strict";

const productValidator = require("../../../service/productValidator");
const Product = use("App/Models/Product");
const Customer = use("App/Models/Customer");
const makeProductUtil = require("../../../util/ProductUtil.func");
const makeCustomerUtil = require("../../../util/CustomerUtil.func");
const numberTypeParamValidator = require("../../../util/numberTypeParamValidator.func");
const performAuthentication = require("../../../util/authenticate.func");

class ProductController {
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
      const { rows, pages } = await makeProductUtil(Product).getAll(
        references,
        page,
        per_page
      );

      return { status: 200, error: undefined, pages, data: rows };
    }

    const { rows, pages } = await makeProductUtil(Product).bulkHasBidableFlag(
      references,
      page,
      per_page
    );

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
      return { status: 422, error: validateValue.error, date: undefined };

    if (admin) {
      const product = await makeProductUtil(Product).getById(id, references);

      return { status: 200, error: undefined, data: product || {} };
    }

    const product = await makeProductUtil(Product).hasBidableFlag(
      id,
      references
    );

    return {
      status: 200,
      error: undefined,
      data: product || {},
    };
  }

  async store({ auth, request }) {
    const { body, qs } = request;

    const { product_name, end_date, stock } = body;

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
        error: "Access denied. this action is reserved for regular user only.",
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

    const validation = await productValidator({
      customer_id,
      product_name,
      end_date,
      stock,
    });

    if (validation.error) {
      return { status: 422, error: validation.error, data: undefined };
    }

    const product = await makeProductUtil(Product).create(
      {
        customer_id,
        product_name,
        end_date,
        stock,
      },
      references
    );

    return {
      status: 200,
      error: undefined,
      data: product,
    };
  }

  async update({ auth, request }) {
    const { body, params, qs } = request;

    const { id } = params;

    const { references } = qs;

    const { product_name, end_date, stock } = body;

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
      const product = await makeProductUtil(Product).updateById(
        id,
        { product_name, end_date, stock },
        references
      );

      return { status: 200, error: undefined, data: product };
    }

    const { customer_id } = await performAuthentication(auth).validateIdParam(
      Customer
    );

    const customerProduct = await makeCustomerUtil(
      Customer
    ).findProductOnAuthUser(customer_id, id);

    if (customerProduct) {
      const product = await makeProductUtil(Product).updateById(
        id,
        { product_name, stock },
        references
      );

      return { status: 200, error: undefined, data: product };
    }

    return {
      status: 403,
      error: "Access denied. id param does not match authenticated id.",
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
      const product = await makeProductUtil(Product).deleteById(id);

      return {
        status: 200,
        error: undefined,
        data: { massage: `${product} is successfully removed.` },
      };
    }

    const { customer_id } = await performAuthentication(auth).validateIdParam();

    if (customer_id === parseInt(id)) {
      const product = await makeProductUtil(Product).deleteById(id);

      return {
        status: 200,
        error: undefined,
        data: { massage: `${product} is successfully removed.` },
      };
    }

    return {
      status: 403,
      error: "Access denied. id param does not match authenticated id.",
      data: undefined,
    };
  }
}

module.exports = ProductController;
