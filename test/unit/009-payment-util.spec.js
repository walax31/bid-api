'use strict'

const makeUserUtil = require('../../util/testerUtil/autogenUserInstance.func')
const makeCustomerUtil = require('../../util/testerUtil/autogenCustomerInstance.func')
const makeOrderUtil = require('../../util/testerUtil/autogenOrderInstance.func')
const makePaymentUtil = require('../../util/PaymentUtil.func')
const makeProductUtil = require('../../util/testerUtil/autogenProductInstance.func')
const makeBidUtil = require('../../util/testerUtil/autogenBidInstance.func')

const { test } = use('Test/Suite')('Payment Util')
const PaymentModel = use('App/Models/Payment')
const OrderModel = use('App/Models/Order')
const CustomerModel = use('App/Models/Customer')
const UserModel = use('App/Models/User')
const ProductModel = use('App/Models/Product')
const BidModel = use('App/Models/Bid')

test('should return empty array of rows from makePaymentUtil', async ({ assert }) => {
  const payments = await makePaymentUtil(PaymentModel).getAll('')

  assert.equal(payments.rows.length, 0)
})

test('should return object of created index from makePaymentUtil.', async ({ assert }) => {
  const user = await makeUserUtil(UserModel)

  const customer = await makeCustomerUtil(CustomerModel, user.uuid)

  const product = await makeProductUtil(ProductModel, customer.uuid)

  const bid = await makeBidUtil(BidModel, customer.uuid, product.uuid)

  const { uuid } = await makeOrderUtil(
    OrderModel,
    customer.uuid,
    product.uuid,
    bid.uuid
  )

  const payment = await makePaymentUtil(PaymentModel).create({
    uuid,
    method: 'banking',
    total: 2
  })

  assert.isOk(payment)

  await UserModel.find(user.uuid).then(query => query.delete())
})

test('should return array of row from makePaymentUtil.', async ({ assert }) => {
  const user = await makeUserUtil(UserModel)

  const customer = await makeCustomerUtil(CustomerModel, user.uuid)

  const product = await makeProductUtil(ProductModel, customer.uuid)

  const bid = await makeBidUtil(BidModel, customer.uuid, product.uuid)

  const { uuid } = await makeOrderUtil(
    OrderModel,
    customer.uuid,
    product.uuid,
    bid.uuid
  )

  await PaymentModel.create({ uuid, method: 'banking', total: 2 })

  const payments = await makePaymentUtil(PaymentModel).getAll('')

  assert.isAbove(payments.rows.length, 0)

  await UserModel.find(user.uuid).then(query => query.delete())
})

test('should return object of requested created index from makePaymentUtil.', async ({ assert }) => {
  const user = await makeUserUtil(UserModel)

  const customer = await makeCustomerUtil(CustomerModel, user.uuid)

  const product = await makeProductUtil(ProductModel, customer.uuid)

  const bid = await makeBidUtil(BidModel, customer.uuid, product.uuid)

  const { uuid } = await makeOrderUtil(
    OrderModel,
    customer.uuid,
    product.uuid,
    bid.uuid
  )

  await PaymentModel.create({ uuid, method: 'banking', total: 2 })

  const payment = await makePaymentUtil(PaymentModel).getById(uuid, '')

  assert.isOk(payment)

  await UserModel.find(user.uuid).then(query => query.delete())
})

test('should return modified object of updated index form makePaymentUtil.', async ({ assert }) => {
  const user = await makeUserUtil(UserModel)

  const customer = await makeCustomerUtil(CustomerModel, user.uuid)

  const product = await makeProductUtil(ProductModel, customer.uuid)

  const bid = await makeBidUtil(BidModel, customer.uuid, product.uuid)

  const { uuid } = await makeOrderUtil(
    OrderModel,
    customer.uuid,
    product.uuid,
    bid.uuid
  )

  await PaymentModel.create({ uuid, method: 'banking', total: 2 })

  const { status } = await makePaymentUtil(PaymentModel)
    .updateById(uuid, { status: 'accepted' }, '')
    .then(response => response.toJSON())

  assert.equal(status, 'accepted')

  await UserModel.find(user.uuid).then(query => query.delete())
})

test('should return index of deleted index from makePaymentUtil.', async ({ assert }) => {
  const user = await makeUserUtil(UserModel)

  const customer = await makeCustomerUtil(CustomerModel, user.uuid)

  const product = await makeProductUtil(ProductModel, customer.uuid)

  const bid = await makeBidUtil(BidModel, customer.uuid, product.uuid)

  const { uuid } = await makeOrderUtil(
    OrderModel,
    customer.uuid,
    product.uuid,
    bid.uuid
  )

  await PaymentModel.create({ uuid, method: 'banking', total: 2 })

  const deletedPayment = await makePaymentUtil(PaymentModel).deleteById(uuid)

  assert.isOk(deletedPayment)

  await UserModel.find(user.uuid).then(query => query.delete())
})
