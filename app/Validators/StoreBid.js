'use strict'

class StoreBid {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      // validation rules
      bid_amount: 'required',
      product_uuid: 'required'
    }
  }

  get messages () {
    return {
      'bid_amount.required': 'You must provide a bid amount.',
      'product_uuid.required': 'You must provide product uuid.'
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.status(400).send(errorMessages)
  }
}

module.exports = StoreBid
