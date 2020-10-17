'use strict'

const broadcastBid = require('../../util/ws/broadcast-product.util.func')
const broadcastAlert = require('../../util/ws/broadcast-alert.util.func')

const Ws = use('Ws')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class Broadcast {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, response }, next, properties = []) {
    // call next to advance the request
    await next()

    if (response.response.statusCode === 200) {
      if (properties.find(property => property === 'bid')) {
        broadcastBid(
          Ws,
          request.body.product_uuid,
          'new:bid',
          // eslint-disable-next-line
          response._lazyBody.content.data.toJSON()
        )
      } else if (
        properties.find(property => property === 'alert') &&
        // eslint-disable-next-line
        response._lazyBody.content.alert
      ) {
        broadcastAlert(
          Ws,
          request.user_uuid,
          'new:alert',
          // eslint-disable-next-line
          response._lazyBody.content.alert.toJSON()
        )
        // eslint-disable-next-line
        response._lazyBody.content.alert = undefined
      }
    }
  }
}

module.exports = Broadcast
