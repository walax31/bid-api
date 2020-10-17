'use strict'

const makeUserUtil = require('../../util/testerUtil/autogenUserInstance.func')
const makeCustomerUtil = require('../../util/testerUtil/autogenCustomerInstance.func')
const makeOrderUtil = require('../../util/OrderUtil.func')
const makeTestOrderUtil = require('../../util/testerUtil/autogenOrderInstance.func')
const makeProductUtil = require('../../util/testerUtil/autogenProductInstance.func')
const makeBidUtil = require('../../util/testerUtil/autogenBidInstance.func')

const { test } = use('Test/Suite')('Order Util')
const OrderModel = use('App/Models/Order')
const CustomerModel = use('App/Models/Customer')
const UserModel = use('App/Models/User')
const ProductModel = use('App/Models/Product')
const BidModel = use('App/Models/Bid')

test('should return empty array of rows from makeOrderUtil', async ({ assert }) => {
  const orders = await makeOrderUtil(OrderModel).getAll('')

  assert.equal(orders.rows.length, 0)
})

test('should return object of created index from makeOrderUtil.', async ({ assert }) => {
  const user = await makeUserUtil(UserModel)

  const customer = await makeCustomerUtil(CustomerModel, user.uuid)

  const product = await makeProductUtil(ProductModel, customer.uuid)

  const bid = await makeBidUtil(BidModel, customer.uuid, product.uuid)

  const { uuid } = await makeOrderUtil(OrderModel)
    .create({
      customer_uuid: customer.uuid,
      product_uuid: product.uuid,
      bid_uuid: bid.uuid,
      order_quantity: 10
    })
    .then(response => response.toJSON())

  assert.isOk(uuid)

  await UserModel.find(user.uuid).then(query => query.delete())
})

test('should return array of row from makeOrderUtil.', async ({ assert }) => {
  const user = await makeUserUtil(UserModel)

  const customer = await makeCustomerUtil(CustomerModel, user.uuid)

  const product = await makeProductUtil(ProductModel, customer.uuid)

  const bid = await makeBidUtil(BidModel, customer.uuid, product.uuid)

  await makeTestOrderUtil(OrderModel, customer.uuid, product.uuid, bid.uuid)

  const orders = await makeOrderUtil(OrderModel).getAll('')

  assert.isAbove(orders.rows.length, 0)

  await UserModel.find(user.uuid).then(query => query.delete())
})

test('should return object of requested created index from makeOrderUtil.', async ({ assert }) => {
  const user = await makeUserUtil(UserModel)

  const customer = await makeCustomerUtil(CustomerModel, user.uuid)

  const product = await makeProductUtil(ProductModel, customer.uuid)

  const bid = await makeBidUtil(BidModel, customer.uuid, product.uuid)

  const { uuid } = await makeTestOrderUtil(
    OrderModel,
    customer.uuid,
    product.uuid,
    bid.uuid
  )

  const order = await makeOrderUtil(OrderModel).getById(uuid, '')

  assert.isOk(order)

  await UserModel.find(user.uuid).then(query => query.delete())
})

test('should return index of deleted index from makeOrderUtil.', async ({ assert }) => {
  const user = await makeUserUtil(UserModel)

  const customer = await makeCustomerUtil(CustomerModel, user.uuid)

  const product = await makeProductUtil(ProductModel, customer.uuid)

  const bid = await makeBidUtil(BidModel, customer.uuid, product.uuid)

  const { uuid } = await makeTestOrderUtil(
    OrderModel,
    customer.uuid,
    product.uuid,
    bid.uuid
  )

  const deletedOrder = await makeOrderUtil(OrderModel).deleteById(uuid)

  assert.isOk(deletedOrder)

  await UserModel.find(user.uuid).then(query => query.delete())
})
