'use strict'

class StoreCredential {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      // validation rules
      credential_image: 'file_ext:png,jpg|file_size:2mb|file_types:image'
    }
  }

  get messages () {
    return {
      'credential_image.file': 'file',
      'credential_image.file_ext': 'ext',
      'credential_image.file_size': 'size',
      'credential_image.file_types': 'type'
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.status(400).send(errorMessages)
  }
}

module.exports = StoreCredential
