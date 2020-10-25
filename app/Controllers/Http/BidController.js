'use strict'

const Bid = use('App/Models/Bid')

const makeBidUtil = require('../../../util/BidUtil.func')

class BidController {
  async index ({ request, response }) {
    const { references, page, per_page } = request.qs

    const { rows, pages } = await makeBidUtil(Bid).getAll(
      references,
      page,
      per_page
    )

    return response.send({
      status: 200,
      error: undefined,
      pages,
      data: rows
    })
  }

  async show ({ request, response }) {
    const { params, qs } = request

    const { id } = params

    const { references } = qs

    const bid = await makeBidUtil(Bid).getById(id, references)

    return response.send({ status: 200, error: undefined, data: bid || {} })
  }

  async store ({ request, response }) {
    const { body, qs } = request

    const { bid_amount, product_uuid } = body

    const { references } = qs

    const bid = await makeBidUtil(Bid).create(
      { customer_uuid: request.customer_uuid, bid_amount, product_uuid },
      references
    )

    return response.send({
      status: 200,
      error: undefined,
      data: bid,
      broadcastProps: [
        {
          broadcastContent: bid.toJSON(),
          broadcastType: 'new',
          broadcastChannel: 'product',
          broadcastTopic: product_uuid
        }
      ]
    })
  }

  async update ({ request, response }) {
    const { body, params, qs } = request

    const { id } = params

    const { references } = qs

    const { bid_amount } = body

    const bid = await makeBidUtil(Bid).updateById(
      id,
      { bid_amount },
      references
    )

    return response.send({ status: 200, error: undefined, data: bid })
  }

  async destroy ({ request, response }) {
    const { id } = request.params

    const bid = await makeBidUtil(Bid).deleteById(id)

    if (bid) {
      return {
        status: 200,
        error: undefined,
        data: `successfully removed bid ${id}.`
      }
    }

    return response.send({
      status: 404,
      error: 'Bid not found. bid you are looking for does not exist.',
      data: undefined
    })
  }
}

module.exports = BidController
