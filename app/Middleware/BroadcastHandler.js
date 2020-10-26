'use strict'

const broadcastAlert = require('../../util/ws/broadcast-alert.util.func')
const broadcastBid = require('../../util/ws/broadcast-product.util.func')

const Ws = use('Ws')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class BroadcastHandler {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ response }, next) {
    // call next to advance the request
    await next()

    /**
     * properties of broadcastProps[] inside response
     * broadcastContent: {
     *  // content of data inside response
     * }
     * broadcastType: string
     * broadcastChannel: string
     * broadcastTopic: string
     * */
    // eslint-disable-next-line
    const { broadcastProps } = response._lazyBody.content

    if (response.response.statusCode === 200 && broadcastProps) {
      broadcastProps.forEach(prop => {
        switch (prop.broadcastChannel) {
          case 'alert': {
            broadcastAlert(
              Ws,
              prop.broadcastTopic,
              `${prop.broadcastType}:${prop.broadcastChannel}`,
              prop.broadcastContent
            )
            break
          }
          case 'bid': {
            broadcastBid(
              Ws,
              prop.broadcastTopic,
              `${prop.broadcastType}:${prop.broadcastChannel}`,
              prop.broadcastContent
            )
            break
          }
          default:
            // eslint-disable-next-line
            console.log('Invalid propType. not broadcasting...')
        }
      })
      // eslint-disable-next-line
      response._lazyBody.content.broadcastProps = undefined
    }
  }
}

module.exports = BroadcastHandler
