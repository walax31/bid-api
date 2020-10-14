'use strict'

class StorePayment {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      // validation rules
      method: 'required',
      total: 'required',
      uuid: 'required'
    }
  }

  get messages () {
    return {
      'method.required': 'You must provide a payment method.',
      'total.required': 'You must provide a order total.',
      'uuid.required': 'You must provide a order uuid.'
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.status(400).send(errorMessages)
  }
}

module.exports = StorePayment
