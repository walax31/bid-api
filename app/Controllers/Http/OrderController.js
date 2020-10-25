'use strict'

const OrderModel = use('App/Models/Order')
const CustomerModel = use('App/Models/Customer')
const ProductModel = use('App/Models/Product')

const makeOrderUtil = require('../../../util/OrderUtil.func')
const makeCustomerUtil = require('../../../util/CustomerUtil.func')
const makeProductUtil = require('../../../util/ProductUtil.func')

class OrderController {
  async index ({ request, response }) {
    const { references } = request.qs

    switch (request.role) {
      case 'admin': {
        const orders = await makeOrderUtil(OrderModel).getAll(references)

        return response.send({ status: 200, error: undefined, data: orders })
      }
      case 'customer': {
        const customerOrders = await makeOrderUtil(OrderModel).getAll(
          references,
          request.customer_uuid
        )

        return response.send({
          status: 200,
          error: undefined,
          data: customerOrders
        })
      }
      default:
        return response.send({ status: 200, error: undefined, data: undefined })
    }
  }

  async show ({ request, response }) {
    const { params, qs } = request

    const { id } = params

    const { references = '' } = qs

    switch (request.role) {
      case 'admin': {
        const order = await makeOrderUtil(OrderModel).getById(id, references)

        return response.send({
          status: 200,
          error: undefined,
          data: order || {}
        })
      }
      case 'customer': {
        const customerOrder = await makeOrderUtil(OrderModel).getById(
          id,
          references,
          request.customer_uuid
        )

        return response.send({
          status: 200,
          error: undefined,
          data: customerOrder || {}
        })
      }
      default:
        return response.send({ status: 200, error: undefined, data: undefined })
    }
  }

  async store ({ request, response }) {
    const { body, qs } = request

    const { customer_uuid, product_uuid, order_quantity, bid_uuid } = body

    const { references } = qs

    // eslint-disable-next-line
    const existingBidOnYourProduct = await makeProductUtil(ProductModel)
      .findExistingBidOnThisProductViaCustomer(customer_uuid, product_uuid)
      .then(query => query.toJSON())

    if (!existingBidOnYourProduct) {
      return response.status(404).send({
        status: 404,
        error: 'Bid not found. this user never put a bid on your product.',
        data: undefined
      })
    }

    // eslint-disable-next-line
    const existingOrderOnThisCustomer = await makeCustomerUtil(
      CustomerModel).findExistingOrder(customer_uuid, product_uuid)

    if (existingOrderOnThisCustomer) {
      return response.status(500).send({
        status: 500,
        error:
          'Duplicate order. order on this specific user has already existed.',
        data: undefined
      })
    }

    const data = await makeOrderUtil(OrderModel).create(
      { customer_uuid, product_uuid, order_quantity, bid_uuid },
      references
    )

    return response.send({
      status: 200,
      error: undefined,
      data
    })
  }

  async update ({ request, response }) {
    const { body, params, qs } = request

    const { id } = params

    const { references } = qs

    const { customer_uuid, product_uuid, order_quantity, bid_uuid } = body

    const existingOrder = await makeOrderUtil(OrderModel).getById(id)

    if (!existingOrder) {
      return response.status(404).send({
        status: 404,
        error: 'Order not found. order you are looking for does not exist.',
        data: undefined
      })
    }

    const order = await makeOrderUtil(OrderModel).updateById(
      id,
      { customer_uuid, product_uuid, order_quantity, bid_uuid },
      references
    )

    return response.send({ status: 200, error: undefined, data: order })
  }

  async destroy ({ request, response }) {
    const { id } = request.params

    const order = await makeOrderUtil(OrderModel).deleteById(id)

    if (!order) {
      return response.status(404).send({
        status: 404,
        error: 'Order not found. order you are looking for does not exist.',
        data: undefined
      })
    }

    return response.send({
      status: 200,
      error: undefined,
      data: 'Order is successfully removed.'
    })
  }
}

module.exports = OrderController
