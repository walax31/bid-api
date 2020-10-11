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
      const { user_uuid, customer_uuid } = await performAuthentication(auth).validateUniqueID(CustomerModel)

      request.user_uuid = user_uuid
      request.customer_uuid = customer_uuid
      request.username = await performAuthentication(auth).getUsername()
    }

    if (!properties.find(prop => prop === 'all')) {
      if (request.role === 'guest') {
        if (!properties.find(prop => prop === 'guest')) {
          response.send({
            status: 403,
            error: 'Access denied. authentication failed.',
            data: undefined
          })
        }
      } else if (!properties.find(prop => prop === request.role)) {
        response.send({
          status: 403,
          error:
            'Access denied. your role does not have access right to this route.',
          data: undefined
        })
      }
    }

    await next()
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  // async wsHandle ({ request }, next) {
  // call next to advance the request
  // await next()
  // }
}

module.exports = Auth
