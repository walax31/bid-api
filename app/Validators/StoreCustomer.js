'use strict'

class StoreCustomer {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      // validation rules
      first_name: 'required',
      last_name: 'required'
    }
  }

  get messages () {
    return {
      'first_name.required': 'You must provide your first name.',
      'last_name.required': 'You must provide your last name.'
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.status(400).send(errorMessages)
  }
}

module.exports = StoreCustomer
