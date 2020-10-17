'use strict'

class ProductController {
  constructor ({ socket, request }) {
    this.socket = socket
    this.request = request

    console.log('A new subscription for this product', socket.topic)
  }

  onMessage (message) {
    console.log('got a new bid', message)
  }

  onClose () {
    console.log('closing subscription for the product', this.socket.topic)
  }
}

module.exports = ProductController
