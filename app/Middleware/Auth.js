'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const CustomerModel = use('App/Models/Customer')

const performAuthentication = require('../../util/authenticate.func')

class Auth {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, response, auth }, next, properties = ['all']) {
    // call next to advance the request
    const { admin, error } = await performAuthentication(auth).validateAdmin()

    if (!error) {
      request.role = admin ? 'admin' : 'customer'
    } else {
      request.role = 'guest'
    }

    if (request.role !== 'guest') {
      // eslint-disable-next-line
      const { user_uuid, customer_uuid } = await performAuthentication(
        auth).validateUniqueID(CustomerModel)

      request.user_uuid = user_uuid
      request.customer_uuid = customer_uuid
      request.username = await performAuthentication(auth).getUsername()
    }

    try {
      if (!properties.find(prop => prop === 'all')) {
        if (request.role === 'guest') {
          if (!properties.find(prop => prop === 'guest')) {
            throw new Error('Access denied. authentication failed.')
          }
        } else if (!properties.find(prop => prop === request.role)) {
          throw new Error('Access denied. your role does not have access right to this route.')
        }
      }
    } catch (e) {
      response.status(403).send({
        status: 403,
        error: e.toString(),
        data: undefined
      })
      return
    }

    await next()
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async wsHandle ({ request, auth }, next) {
    // call next to advance the request
    await next()
  }
}

module.exports = Auth
