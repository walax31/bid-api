"use strict";

// const Helpers = use("Helpers");
const Drive = use("Drive");
const customerValidator = require("../../../service/customerValidator");
const Customer = use("App/Models/Customer");
const User = use("App/Models/User");
const makeCustomerUtil = require("../../../util/CustomerUtil.func");
const makeUserUtil = require("../../../util/UserUtil.func");
const numberTypeParamValidator = require("../../../util/numberTypeParamValidator.func");
const performAuthentication = require("../../../util/authenticate.func");

class CustomerController {
  async index({ auth, request }) {
    const { references, page, per_page } = request.qs;

    const { admin, error } = await performAuthentication(auth).validateAdmin();

    if (error) {
      return {
        status: 403,
        error: "Access denied. authentication failed.",
        data: undefined,
      };
    }

    if (admin) {
      const { rows, pages } = await makeCustomerUtil(Customer).getAll(
        references,
        page,
        per_page
      );

      return {
        status: 200,
        error: undefined,
        pages,
        data: rows,
      };
    }

    const { customer_id } = await performAuthentication(auth).validateIdParam();

    const validatedCredential = await makeCustomerUtil(
      Customer
    ).hasCredentialValidated(customer_id);

    if (validatedCredential) {
      const { rows, pages } = await makeCustomerUtil(Customer).getAll(
        references,
        page,
        per_page
      );

      return {
        status: 200,
        error: undefined,
        pages,
        data: rows,
      };
    }

    return {
      status: 403,
      error: "Access denied. invalid credential.",
      data: undefined,
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
      const customer = await makeCustomerUtil(Customer).getById(id, references);

      return { status: 200, error: undefined, data: customer || {} };
    }

    const { customer_id } = await performAuthentication(auth).validateIdParam();

    const validatedCredential = await makeCustomerUtil(
      Customer
    ).hasCredentialValidated(customer_id);

    if (validatedCredential) {
      const customer = await makeCustomerUtil(Customer).getById(id, references);

      return { status: 200, error: undefined, data: customer || {} };
    }

    return {
      status: 403,
      error: "Access denied. invalid credential.",
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
        error: "Access denied. authentication failed.",
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
      },
      references
    );

    const flaggedUser = await makeUserUtil(User).flagSubmition(auth_id);

    if (!flaggedUser)
      return {
        status: 500,
        error: "Internal error. failed to flag user submittion.",
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
        error: "Access denied. authentication failed.",
        data: undefined,
      };

    const validateValue = numberTypeParamValidator(id);

    if (validateValue.error)
      return { status: 422, error: validateValue.error, date: undefined };

    if (admin) {
      const submittedUser = await makeUserUtil(User).hasSubmittionFlagged(id);

      if (!submittedUser)
        return {
          status: 404,
          error: "User not found. this user never submitted credential.",
          data: undefined,
        };

      const { customer_id, is_validated } = await makeCustomerUtil(
        Customer
      ).validateUserCredential(id, references);

      return {
        status: 200,
        error: undefined,
        data: { customer_id, is_validated },
      };
    }

    const { customer_id } = await performAuthentication(auth).validateIdParam(
      Customer
    );

    if (customer_id === parseInt(id)) {
      const username = await performAuthentication(auth).getUsername();

      const fileList = [];

      try {
        request.multipart.file(
          "credential_image",
          { types: ["image"], size: "2mb", extnames: ["png", "gif"] },
          async (file) => {
            if (
              !(file.extname === "png") &&
              !(file.extname === "jpg") &&
              !(file.extname === "jpeg")
            )
              return {
                status: 422,
                error: "Validation failed. contain illegal file type.",
                data: undefined,
              };

            await Drive.disk("s3").put(
              `${username}.${file.extname}`,
              file.stream
            );

            fileList.push(`${username}.${file.extname}`);
          }
        );

        await request.multipart.process();
      } catch (error) {
        if (!error.message === "unsupported content-type")
          return { status: 500, error, data: undefined };
      }

      if (first_name || last_name || address || phone || fileList.length) {
        const customer = await makeCustomerUtil(Customer).updateById(
          customer_id,
          {
            first_name,
            last_name,
            address,
            phone,
            path_to_credential: fileList.length
              ? fileList.join(",")
              : undefined,
          },
          references
        );

        return { status: 200, error: undefined, data: customer };
      }

      return {
        status: 422,
        error: "Missing params. update query is empty.",
        data: undefined,
      };
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
      await makeCustomerUtil(Customer).deleteById(id);

      return {
        status: 200,
        error: undefined,
        data: "customer is successfully removed.",
      };
    }

    const { customer_id } = await performAuthentication(auth).validateIdParam();

    if (customer_id === parseInt(id)) {
      await makeCustomerUtil(Customer).deleteById(customer_id);

      return {
        status: 200,
        error: undefined,
        data: "customer is successfully removed.",
      };
    }

    return {
      status: 403,
      error: "Access denied. id param does not match authenticated id.",
      data: undefined,
    };
  }
}

module.exports = CustomerController;
