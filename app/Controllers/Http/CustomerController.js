"use strict";

const Database = use(`Database`);
// const Validator = use("Validator");
const Customer = use("App/Models/Customer");
const makeCustomerUtil = require("../../../util/CustomerUtil.func");

function numberTypeParamValidator(number) {
  if (Number.isNaN(parseInt(number))) {
    return {
      error: `param:${number} is not supported,please use number type param intnstead`,
    };
  }
  return {};
}


class CustomerController {
  async index({ request }) {
    const { references = undefined } = request.qs;
    const customer = await makeCustomerUtil(Customer).getAll(references);

    return { status: 200, error: undefined, data: customer };
  }

  async show({ request }) {
    const { id } = request.params;
    const { references } = request.qs;

    const validateValue = numberTypeParamValidator(id);
    if (validateValue.error)
      return { status: 500, error: validateValue.error, date: undefined };

    const customer = await makeCustomerUtil(Customer).getAll(references);
    return { status: 200, error: undefined, data: customer || {} };
  }

  async store({ request }) {
    const {
      customer_first_name,
      customer_last_name,
      customer_address,
      customer_phone,
      customer_path_to_credential,
    } = request.body;

    const rules = {
      customer_first_name: "required",
      customer_last_name: "required",
      customer_phone: "required",
      customer_address: "required",
      customer_path_to_credential: "required",
    };
    const customer = await makeCustomerUtil(Customer).create(
      {
        customer_first_name,
        customer_last_name,
        customer_address,
        customer_phone,
        customer_path_to_credential,
      },
      rules
    );
    return {
      status: 200,
      error: undefined,
      data: customer_first_name,
      customer_last_name,
      customer_address,
      customer_phone,
      customer_path_to_credential,
    };
  }
  async update({ request }) {
    const { body, params } = request;
    const { id } = params;
    const { customer_first_name } = body;
    const { customer_last_name } = body;
    const { customer_address } = body;
    const { customer_phone } = body;
    const { customer_path_to_credential } = body;

    const customerID = await Database.table("customers")
      .where({ customer_id: id })
      .update({
        customer_first_name,
        customer_last_name,
        customer_address,
        customer_phone,
        customer_path_to_credential}
      );
  
    const customer = await Database.table("customers")
      .where({ customer_id: customerID })
      .first();

    return { status: 200, error: undefined, data: customer };
  }
  async destroy({ request }) {
    const { id } = request.params;
    await Database.table("customers").where({ customer_id: id }).delete();

    return { status: 200, error: undefined, data: { massage: "success" } };
  }
}

module.exports = CustomerController;
