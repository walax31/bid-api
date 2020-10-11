'use strict'

const makeUserUtil = require('../../util/testerUtil/autogenUserInstance.func')
const makeCustomerUtil = require('../../util/testerUtil/autogenCustomerInstance.func')
const makeProductUtil = require('../../util/testerUtil/autogenProductInstance.func')
const makeBidUtil = require('../../util/BidUtil.func')

const { test } = use('Test/Suite')('Bid Util')
const BidModel = use('App/Models/Bid')
const ProductModel = use('App/Models/Product')
const CustomerModel = use('App/Models/Customer')
const UserModel = use('App/Models/User')

test('should return empty array of rows from makeBidUtil', async ({ assert }) => {
  const bids = await makeBidUtil(BidModel).getAll('')

  assert.equal(bids.rows.length, 0)
})

test('should return object of created index from makeBidUtil.', async ({ assert }) => {
  const user = await makeUserUtil(UserModel)

  const customer = await makeCustomerUtil(CustomerModel, user.uuid)

  const product = await makeProductUtil(ProductModel, customer.uuid)

  const { uuid } = await makeBidUtil(BidModel)
    .create({
      customer_uuid: customer.uuid,
      bid_amount: 1100,
      product_uuid: product.uuid
    })
    .then(response => response.toJSON())

  assert.isOk(uuid)

  await UserModel.find(user.uuid).then(query => query.delete())
})

test('should return array of row from makeBidUtil.', async ({ assert }) => {
  const user = await makeUserUtil(UserModel)

  const customer = await makeCustomerUtil(CustomerModel, user.uuid)

  const product = await makeProductUtil(ProductModel, customer.uuid)

  await BidModel.create({
    customer_uuid: customer.uuid,
    bid_amount: 1100,
    product_uuid: product.uuid
  })

  const bids = await makeBidUtil(BidModel).getAll('')

  assert.isAbove(bids.rows.length, 0)

  await UserModel.find(user.uuid).then(query => query.delete())
})

test('should return object of requested created index from makeBidUtil.', async ({ assert }) => {
  const user = await makeUserUtil(UserModel)

  const customer = await makeCustomerUtil(CustomerModel, user.uuid)

  const product = await makeProductUtil(ProductModel, customer.uuid)

  const { uuid } = await BidModel.create({
    customer_uuid: customer.uuid,
    bid_amount: 1100,
    product_uuid: product.uuid
  }).then(response => response.toJSON())

  const bid = await makeBidUtil(BidModel).getById(uuid, '')

  assert.isOk(bid)

  await UserModel.find(user.uuid).then(query => query.delete())
})

test('should return modified object of updated index form makeBidUtil.', async ({ assert }) => {
  const user = await makeUserUtil(UserModel)

  const customer = await makeCustomerUtil(CustomerModel, user.uuid)

  const product = await makeProductUtil(ProductModel, customer.uuid)

  const { uuid } = await BidModel.create({
    customer_uuid: customer.uuid,
    bid_amount: 1100,
    product_uuid: product.uuid
  }).then(response => response.toJSON())

  const { bid_amount } = await makeBidUtil(BidModel)
    .updateById(uuid, { bid_amount: 1200 }, '')
    .then(response => response.toJSON())

  assert.equal(bid_amount, 1200)

  await UserModel.find(user.uuid).then(query => query.delete())
})

test('should return index of deleted index from makeBidUtil.', async ({ assert }) => {
  const user = await makeUserUtil(UserModel)

  const customer = await makeCustomerUtil(CustomerModel, user.uuid)

  const product = await makeProductUtil(ProductModel, customer.uuid)

  const { uuid } = await BidModel.create({
    customer_uuid: customer.uuid,
    bid_amount: 1100,
    product_uuid: product.uuid
  }).then(response => response.toJSON())

  const deletedBid = await makeBidUtil(BidModel).deleteById(uuid)

  assert.isOk(deletedBid)

  await UserModel.find(user.uuid).then(query => query.delete())
})
