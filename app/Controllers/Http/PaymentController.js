'use strict'

const PaymentModel = use('App/Models/Payment')
const OrderModel = use('App/Models/Order')

const makePaymentUtil = require('../../../util/PaymentUtil.func')
const makeOrderUtil = require('../../../util/OrderUtil.func')

class PaymentController {
  async index ({ request, response }) {
    const { references, page, per_page } = request.qs

    switch (request.role) {
      case 'admin': {
        const payment = await makePaymentUtil(PaymentModel).getAll(
          references,
          page,
          per_page
        )

        return response.send({
          status: 200,
          error: undefined,
          pages: payment.pages,
          data: payment.rows
        })
      }
      case 'customer': {
        const customerPayment = await makePaymentUtil(PaymentModel).getAll(
          references,
          page,
          per_page,
          request.customer_uuid
        )

        return response.send({
          status: 200,
          error: undefined,
          pages: customerPayment.pages,
          data: customerPayment.rows
        })
      }
      default:
        return response.send({
          status: 200,
          error: undefined,
          pages: undefined,
          data: undefined
        })
    }
  }

  async show ({ request, response }) {
    const { params, qs } = request

    const { id } = params

    const { references } = qs

    const payment = await makePaymentUtil(PaymentModel).getById(id, references)

    return response.send({ status: 200, error: undefined, data: payment || {} })
  }

  async store ({ request, response }) {
    const { body, qs } = request

    const { uuid, method, status, total } = body

    const { references } = qs

    const existingPayment = await makePaymentUtil(PaymentModel).findExistingPayment(uuid)

    if (existingPayment) {
      return response.status(500).send({
        status: 500,
        error: 'Duplicate payment. payment already existed.',
        data: undefined
      })
    }

    const existingOrder = await makeOrderUtil(OrderModel).getById(uuid)

    if (!existingOrder) {
      return response.status(404).send({
        status: 404,
        error: 'Order not found. you never ordered this product.',
        data: undefined
      })
    }

    const payment = await makePaymentUtil(PaymentModel).create(
      {
        method,
        status,
        total,
        uuid
      },
      references
    )

    return response.send({
      status: 200,
      error: undefined,
      data: payment
    })
  }

  async update ({ request, response }) {
    const { body, params, qs } = request

    const { id } = params

    const { references } = qs

    const { method, status, total } = body

    const existingPayment = await makePaymentUtil(PaymentModel).getById(id)

    if (!existingPayment) {
      return response.status(404).send({
        status: 404,
        error: 'Payment not found. payment you are looking for does not exist.',
        data: undefined
      })
    }

    const payment = await makePaymentUtil(PaymentModel).updateById(
      id,
      { method, status, total },
      references
    )

    return response.send({ status: 200, error: undefined, data: payment })
  }

  async destroy ({ request, response }) {
    const { id } = request.params

    const payment = await makePaymentUtil(PaymentModel).deleteById(id)

    if (!payment) {
      return response.status(404).send({
        status: 404,
        error: 'Payment not found. payment you are looking for does not exist.',
        data: undefined
      })
    }

    return response.send({
      status: 200,
      error: undefined,
      data: 'Payment is successfully removed.'
    })
  }
}

module.exports = PaymentController
