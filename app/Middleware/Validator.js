'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const ProductModel = use('App/Models/Product')
const makeProductUtil = require('../../util/ProductUtil.func')

class Validator {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, response }, next, properties = []) {
    if (properties.find(property => property === 'bid')) {
      const { bid_amount, product_uuid } = request.body

      const isBiddable = await makeProductUtil(ProductModel).hasBiddableFlag(product_uuid)

      if (!isBiddable) {
        response.send({
          status: 403,
          error: 'Access denied. product is not yet biddable.'
        })
      }

      // eslint-disable-next-line
      const existingBids = await makeProductUtil(ProductModel)
        .findExistingBidOnThisProduct(product_uuid)
        .then(query => query.toJSON())

      if (existingBids.length) {
        const sortedBid = existingBids.sort((a, b) => b.bid_amount - a.bid_amount)

        const highestBid = sortedBid[0].bid_amount

        const { product_bid_increment } = await makeProductUtil(ProductModel)
          .getById(product_uuid, 'productDetail')
          .then(query => query.getRelated('productDetail').toJSON())

        if (!product_bid_increment) {
          response.send({
            status: 404,
            error:
              'Product not found. product you are looking for does not exist.',
            data: undefined
          })
        }

        if (bid_amount < highestBid + product_bid_increment) {
          response.send({
            status: 422,
            error:
              'Requirement not met. your bid amount is lower than minimum biddable amount.'
          })
        }
      } else {
        const { product_bid_start } = await makeProductUtil(ProductModel)
          .getById(product_uuid, 'productDetail')
          .then(query => query.getRelated('productDetail').toJSON())

        if (!product_bid_start) {
          response.send({
            status: 404,
            error:
              'Product not found. product you are looking for does not exist.',
            data: undefined
          })
        }

        if (bid_amount < product_bid_start) {
          response.send({
            status: 422,
            error:
              'Requirement not met. your bid amount is lower than minimum starting point.',
            data: undefined
          })
        }
      }
    }
    // call next to advance the request
    await next()
  }
}

module.exports = Validator
