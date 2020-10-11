'use strict'

const Order = use('App/Models/Order')
const Customer = use('App/Models/Customer')
const Product = use('App/Models/Product')

const makeOrderUtil = require('../../../util/OrderUtil.func')
const makeCustomerUtil = require('../../../util/CustomerUtil.func')
const makeProductUtil = require('../../../util/ProductUtil.func')

class OrderController {
  async index ({ request }) {
    const { references } = request.qs

    switch (request.role) {
      case 'admin': {
        const orders = await makeOrderUtil(Order).getAll(references)

        return { status: 200, error: undefined, data: orders }
      }
      case 'customer': {
        const customerOrders = await makeOrderUtil(Order).getAll(
          references,
          request.customer_uuid
        )

        return { status: 200, error: undefined, data: customerOrders }
      }
      default:
        return { status: 200, error: undefined, data: undefined }
    }
  }

  async show ({ request }) {
    const { params, qs } = request

    const { id } = params

    const { references = '' } = qs

    switch (request.role) {
      case 'admin': {
        const order = await makeOrderUtil(Order).getById(id, references)

        return { status: 200, error: undefined, data: order || {} }
      }
      case 'customer': {
        const customerOrder = await makeOrderUtil(Order).getById(
          id,
          references,
          request.customer_uuid
        )

        return { status: 200, error: undefined, data: customerOrder || {} }
      }
      default:
        return { status: 200, error: undefined, data: undefined }
    }
  }

  async store ({ request }) {
    const { body, qs } = request

    const { customer_uuid, product_uuid, order_quantity } = body

    const { references } = qs

    const authorProduct = await makeCustomerUtil(Customer).findProductOnAuthUser(request.customer_uuid, product_uuid)

    if (!authorProduct) {
      return {
        status: 403,
        error:
          "Access denied. cannot initiate order for product you don't own.",
        data: undefined
      }
    }

    const existingBidOnYourProduct = await makeProductUtil(Product).findExistingBidForThisProduct(customer_uuid, product_uuid)

    if (!existingBidOnYourProduct) {
      return {
        status: 404,
        error: 'Bid not found. this user never put a bid on your product.',
        data: undefined
      }
    }

    const existingOrderOnThisCustomer = await makeCustomerUtil(Customer).findExistingOrder(customer_uuid, product_uuid)

    if (existingOrderOnThisCustomer) {
      return {
        status: 500,
        error:
          'Duplicate order. order on this specific user has already existed.',
        data: undefined
      }
    }

    const data = await makeOrderUtil(Order).create(
      { customer_uuid, product_uuid, order_quantity },
      references
    )

    return {
      status: 200,
      error: undefined,
      data
    }
  }

  async update ({ request }) {
    const { body, params, qs } = request

    const { id } = params

    const { references } = qs

    const { customer_uuid, product_uuid, order_quantity } = body

    const existingOrder = await makeOrderUtil(Order).getById(id)

    if (!existingOrder) {
      return {
        status: 404,
        error: 'Order not found. order you are looking for does not exist.',
        data: undefined
      }
    }

    const order = await makeOrderUtil(Order).updateById(
      id,
      { customer_uuid, product_uuid, order_quantity },
      references
    )

    return { status: 200, error: undefined, data: order }
  }

  async destroy ({ request }) {
    const { id } = request.params

    const order = await makeOrderUtil(Order).deleteById(id)

    if (!order) {
      return {
        status: 404,
        error: 'Order not found. order you are looking for does not exist.',
        data: undefined
      }
    }

    return {
      status: 200,
      error: undefined,
      data: 'Order is successfully removed.'
    }
  }
}

module.exports = OrderController
