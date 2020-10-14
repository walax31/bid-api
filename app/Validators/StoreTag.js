'use strict'

class StoreTag {
  get rules () {
    return {
      // validation rules
      tag_name: 'required|unique:tags,tag_name'
    }
  }

  get messages () {
    return {
      'tag_name.require': 'You must provide tag name.',
      'tag_name.unique': 'Provided tag name must be unique.'
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.status(400).send(errorMessages)
  }
}

module.exports = StoreTag
