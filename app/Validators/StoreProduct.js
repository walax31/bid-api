'use strict'

class StoreProduct {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      // validation rules
      product_name: 'required',
      stock: 'required'
    }
  }

  get messages () {
    return {
      'product_name.required': 'You must provide a product name.',
      'stock.required': 'You must provide stock amounts.'
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.status(400).send(errorMessages)
  }
}

module.exports = StoreProduct
