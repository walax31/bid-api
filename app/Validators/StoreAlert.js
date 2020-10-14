'use strict'

class StoreAlert {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      // validation rules
      user_uuid: 'required',
      type: 'required',
      content: 'required',
      reference: 'required'
    }
  }

  get messages () {
    return {
      'user_uuid.required': 'You must provide a user_uuid.',
      'type.required': 'You must provide a type.',
      'content.required': 'You must provide a content.',
      'reference.required': 'You must provide a reference.'
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.status(400).send(errorMessages)
  }
}

module.exports = StoreAlert
