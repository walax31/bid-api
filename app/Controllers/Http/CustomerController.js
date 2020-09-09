"use strict";

const customerValidator = require("../../../service/customerValidator");
const Customer = use("App/Models/Customer");
const makeCustomerUtil = require("../../../util/CustomerUtil.func");
const numberTypeParamValidator = require("../../../util/numberTypeParamValidator.func");




class CustomerController {
  async index({ request }) {
    const { references  } = request.qs;
    const customers = await makeCustomerUtil(Customer).getAll(references);

    return { status: 200, error: undefined, data: customers };
  }

  async show({ request }) {
    const { params, qs } = request;

    const { id } = params;

    const { references } = qs;

    const validateValue = numberTypeParamValidator(id);

    const validateValue = numberTypeParamValidator(id);
    if (validateValue.error)
      return { status: 500, error: validateValue.error, date: undefined };

    const customer = await makeCustomerUtil(Customer).getById(id,references);
    
    return { status: 200, error: undefined, data: customer || {} };
  }

  async store({ request }) {
    const { body, qs } = request;
    const {
      customer_first_name,
      customer_last_name,
      customer_address,
      customer_phone,
      customer_path_to_credential,
    } =body;
    const { references } = qs;
    
    const validation = await bidValidator(request.body);
    if (validation.error) {
      return { status: 422, error: validation.error, data: undefined };
    }

    const customer = await makeCustomerUtil(Customer).create(
      {
        customer_first_name,
        customer_last_name,
        customer_address,
        customer_phone,
        customer_path_to_credential,
      },
      references
    );
    return {
      status: 200,
      error: undefined,
      data: customer
    };
  }
  async update({ request }) {
    const { body, params, qs } = request;

    const { id } = params;

    const { references } = qs;
    const { customer_first_name,
      customer_last_name,
      customer_address,
      customer_phone,
      customer_path_to_credential}= body;

   const customer = await makeCustomerUtil(Customer).updateById(id,{customer_first_name,
    customer_last_name,
    customer_address,
    customer_phone,
    customer_path_to_credential},references)
    return { status: 200, error: undefined, data: customer };
  }
  async destroy({ request }) {
    const { id } = request.params;
    
    const suctomer =await makeCustomerUtil(Customer).deleteById(id);
    return { status: 200, error: undefined, data: { massage: `${customer} is successfully removed.` } };
  }
}

module.exports = CustomerController;
