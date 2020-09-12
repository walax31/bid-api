"use strict";

const Helpers = use("Helpers");
// const Drive = use("Drive");
const customerValidator = require("../../../service/customerValidator");
const Customer = use("App/Models/Customer");
const User = use("App/Models/User");
const makeCustomerUtil = require("../../../util/CustomerUtil.func");
const makeUserUtil = require("../../../util/UserUtil.func");
const numberTypeParamValidator = require("../../../util/numberTypeParamValidator.func");
const performAuthentication = require("../../../util/authenticate.func");
// const processMultiPartFile = require("../../../service/multiPartFileProcessor");

class CustomerController {
  async index({ auth, request }) {
    const { references } = request.qs;

    const { admin, error } = await performAuthentication(auth).validateAdmin();

    if (error) {
      return {
        status: 403,
        error,
        data: undefined,
      };
    }

    if (admin) {
      const customers = await makeCustomerUtil(Customer).getAll(references);

      return { status: 200, error: undefined, data: customers };
    }

    return {
      status: 200,
      error: "admin validation failed.",
      data: undefined,
    };
  }

  async show({ auth, request }) {
    const { params, qs } = request;

    const { id } = params;

    const { references } = qs;

    const { admin, error } = performAuthentication(auth).validateAdmin();

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
      const customer = await makeCustomerUtil(Customer).getById(id, references);

      return { status: 200, error: undefined, data: customer || {} };
    }

    const auth_id = await performAuthentication(auth).validateIdParam();

    if (auth_id === parseInt(id)) {
      const customer = await makeCustomerUtil(Customer).getById(
        auth_id,
        references
      );

      return { status: 200, error: undefined, data: customer || {} };
    }

    return {
      status: 403,
      error: "id param does not match credential id.",
      data: undefined,
    };
  }

  async store({ auth, request }) {
    const { body, qs } = request;

    const {
      first_name,
      last_name,
      address,
      phone,
      // path_to_credential,
    } = body;

    const { references } = qs;

    const { error } = await performAuthentication(auth).authenticate();

    if (error)
      return {
        status: 403,
        error,
        data: undefined,
      };

    const { auth_id } = await performAuthentication(auth).validateIdParam();

    const validation = await customerValidator({
      user_id: auth_id,
      first_name,
      last_name,
      address,
      phone,
    });

    if (validation.error) {
      return { status: 422, error: validation.error, data: undefined };
    }

    const customer = await makeCustomerUtil(Customer).create(
      {
        user_id: auth_id,
        first_name,
        last_name,
        address,
        phone,
        // path_to_credential,
      },
      references
    );

    const flaggedUser = await makeUserUtil(User).flagSubmition(
      auth_id,
      references
    );

    if (!flaggedUser)
      return {
        status: 500,
        error: "Failed to flag user submittion.",
        data: undefined,
      };

    return {
      status: 200,
      error: undefined,
      data: customer,
    };
  }

  async update({ auth, request }) {
    const { body, params, qs } = request;

    const { id } = params;

    const { references } = qs;

    const { first_name, last_name, address, phone } = body;

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
      const { customer_id, is_validated } = await makeCustomerUtil(
        Customer
      ).validateUserCredential(id, references);

      return {
        status: 200,
        error: undefined,
        data: { customer_id, is_validated },
      };
    }

    const { auth_id } = await performAuthentication(auth).validateIdParam();

    if (auth_id === parseInt(id)) {
      const customer = await makeCustomerUtil(Customer).updateById(
        auth_id,
        {
          first_name,
          last_name,
          address,
          phone,
        },
        references
      );

      return { status: 200, error: undefined, data: customer };
    }

    return {
      status: 200,
      error: "id param does not match credential id.",
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
      const customer = await makeCustomerUtil(Customer).deleteById(id);

      return {
        status: 200,
        error: undefined,
        data: { massage: `${customer} is successfully removed.` },
      };
    }

    const { auth_id } = await performAuthentication(auth).validateIdParam();

    if (auth_id === parseInt(id)) {
      const customer = await makeCustomerUtil(Customer).deleteById(auth_id);

      return {
        status: 200,
        error: undefined,
        data: { massage: `${customer} is successfully removed.` },
      };
    }

    return {
      status: 200,
      error: "id param does not match credential id.",
      data: undefined,
    };
  }
}

module.exports = CustomerController;
