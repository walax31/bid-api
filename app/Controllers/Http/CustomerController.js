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

    const { customer_uuid } = await performAuthentication(
      auth
    ).validateUniqueID(Customer);

    const validatedCredential = await makeCustomerUtil(
      Customer
    ).hasCredentialValidated(customer_uuid);

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

    const { customer_uuid } = await performAuthentication(
      auth
    ).validateUniqueID(Customer);

    const validatedCredential = await makeCustomerUtil(
      Customer
    ).hasCredentialValidated(customer_uuid);

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

    const { user_uuid } = await performAuthentication(auth).validateUniqueID();

    const validation = await customerValidator({
      user_uuid,
      first_name,
      last_name,
    });

    if (validation.error) {
      return { status: 422, error: validation.error, data: undefined };
    }

    const customer = await makeCustomerUtil(Customer).create(
      {
        user_uuid,
        first_name,
        last_name,
      },
      references
    );

    const flaggedUser = await makeUserUtil(User).flagSubmition(user_uuid);

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

    const { first_name, last_name } = body;

    const { admin, error } = await performAuthentication(auth).validateAdmin();

    if (error)
      return {
        status: 403,
        error: "Access denied. authentication failed.",
        data: undefined,
      };

    //     const validateValue = numberTypeParamValidator(id);

    //     if (validateValue.error)
    //       return { status: 422, error: validateValue.error, date: undefined };

    if (admin) {
      const { customer_uuid } = await makeUserUtil(User)
        .hasSubmittionFlagged(id)
        .then((response) => response.toJSON());

      if (!customer_uuid)
        return {
          status: 404,
          error: "User not found. this user never submitted credential.",
          data: undefined,
        };

      const { is_validated } = await makeCustomerUtil(
        Customer
      ).validateUserCredential(customer_uuid, references);

      return {
        status: 200,
        error: undefined,
        data: { customer_uuid, is_validated },
      };
    }

    const { customer_uuid } = await performAuthentication(
      auth
    ).validateUniqueID(Customer);

    if (customer_uuid === id) {
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

      if (first_name || last_name || fileList.length) {
        const customer = await makeCustomerUtil(Customer).updateById(
          customer_uuid,
          {
            first_name,
            last_name,
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

    // const validateValue = numberTypeParamValidator(id);

    // if (validateValue.error)
    //   return { status: 422, error: validateValue.error, date: undefined };

    if (admin) {
      await makeCustomerUtil(Customer).deleteById(id);

      return {
        status: 200,
        error: undefined,
        data: "customer is successfully removed.",
      };
    }

    const { customer_uuid } = await performAuthentication(
      auth
    ).validateUniqueID(Customer);

    if (customer_uuid === id) {
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
