'use strict'

class StoreProductDetail {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      // validation rules
      uuid: 'required',
      product_price: 'required',
      product_bid_start: 'required',
      product_bid_increment: 'required',
      product_description: 'required'
    }
  }

  get messages () {
    return {
      'uuid.required': 'You must provide an uuid.',
      'product_price.required': 'You must provide a product price.',
      'product_bid_start.required':
        'You must provide a starting price for the product.',
      'product_bid_increment.required':
        'You must provide an incrementing price for the product.',
      'product_description.required': 'You must provide a product desciption.'
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.status(400).send(errorMessages)
  }
}

module.exports = StoreProductDetail
