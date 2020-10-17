'use strict'

const Bid = use('App/Models/Bid')

const makeBidUtil = require('../../../util/BidUtil.func')
// const broadcast = require('../../../util/ws/broadcast-product.util.func')

// const Ws = use('Ws')

class BidController {
  async index ({ request }) {
    const { references, page, per_page } = request.qs

    const { rows, pages } = await makeBidUtil(Bid).getAll(
      references,
      page,
      per_page
    )

    return {
      status: 200,
      error: undefined,
      pages,
      data: rows
    }
  }

  async show ({ request }) {
    const { params, qs } = request

    const { id } = params

    const { references } = qs

    const bid = await makeBidUtil(Bid).getById(id, references)

    return { status: 200, error: undefined, data: bid || {} }
  }

  async store ({ request }) {
    const { body, qs } = request

    const { bid_amount, product_uuid } = body

    const { references } = qs

    const bid = await makeBidUtil(Bid).create(
      { customer_uuid: request.customer_uuid, bid_amount, product_uuid },
      references
    )

    // broadcast(Ws, product_uuid, 'product:newBid', bid.toJSON())

    return {
      status: 200,
      error: undefined,
      data: bid
    }
  }

  async update ({ request }) {
    const { body, params, qs } = request

    const { id } = params

    const { references } = qs

    const { bid_amount } = body

    const bid = await makeBidUtil(Bid).updateById(
      id,
      { bid_amount },
      references
    )

    return { status: 200, error: undefined, data: bid }
  }

  async destroy ({ request }) {
    const { id } = request.params

    const bid = await makeBidUtil(Bid).deleteById(id)

    if (bid) {
      return {
        status: 200,
        error: undefined,
        data: `successfully removed bid ${id}.`
      }
    }

    return {
      status: 404,
      error: 'Bid not found. bid you are looking for does not exist.',
      data: undefined
    }
  }
}

module.exports = BidController
