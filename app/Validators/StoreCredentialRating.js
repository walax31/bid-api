'use strict'

class StoreCredentialRating {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      // validation rules
      customer_uuid: 'required',
      rating_score: 'required',
      rating_description: 'required'
    }
  }

  get messages () {
    return {
      'customer_uuid.required': 'You must provide a uuid of customer.',
      'rating_score.required': 'You must provide a rating score.',
      'rating_description.required': 'You must provide a rating description.'
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.status(400).send(errorMessages)
  }
}

module.exports = StoreCredentialRating
