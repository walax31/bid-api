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

    // eslint-disable-next-line
    const { alert } = response._lazyBody.content
    // eslint-disable-next-line
    const { alerts } = response._lazyBody.content

    if (response.response.statusCode === 200) {
      if (properties.find(property => property === 'bid')) {
        broadcastBid(
          Ws,
          request.body.product_uuid,
          'new:bid',
          // eslint-disable-next-line
          response._lazyBody.content.data.toJSON()
        )
      } else if (properties.find(property => property === 'alert') && alert) {
        // eslint-disable-next-line
        const { broadcastType = 'new' } = response._lazyBody.content

        broadcastAlert(Ws, alert.user_uuid, `${broadcastType}:alert`, alert)
        // eslint-disable-next-line
        response._lazyBody.content.broadcastType = undefined
      } else if (
        properties.find(property => property === 'alert') &&
        alerts &&
        alerts.length
      ) {
        // eslint-disable-next-line
        const { broadcastType = 'new' } = response._lazyBody.content
        console.log(alerts)

        alerts.forEach(alertInstance => {
          broadcastAlert(
            Ws,
            alertInstance.user_uuid,
            `${broadcastType}:alert`,
            alertInstance
          )
        })
        // eslint-disable-next-line
        response._lazyBody.content.broadcastType = undefined
      }
    }
  }
}

module.exports = Broadcast
