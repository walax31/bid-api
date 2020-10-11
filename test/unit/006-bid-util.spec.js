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
  const { user_id } = await makeUserUtil(UserModel)

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id)

  const { product_id } = await makeProductUtil(ProductModel, customer_id)

  const { bid_id } = await makeBidUtil(BidModel)
    .create({
      customer_id,
      bid_amount: 1100,
      product_id
    })
    .then(response => response.$attributes)

  assert.isOk(bid_id)

  await UserModel.find(user_id).then(query => query.delete())
})

test('should return array of row from makeBidUtil.', async ({ assert }) => {
  const { user_id } = await makeUserUtil(UserModel)

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id)

  const { product_id } = await makeProductUtil(ProductModel, customer_id)

  await BidModel.create({ customer_id, bid_amount: 1100, product_id })

  const bids = await makeBidUtil(BidModel).getAll('')

  assert.isAbove(bids.rows.length, 0)

  await UserModel.find(user_id).then(query => query.delete())
})

test('should return object of requested created index from makeBidUtil.', async ({ assert }) => {
  const { user_id } = await makeUserUtil(UserModel)

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id)

  const { product_id } = await makeProductUtil(ProductModel, customer_id)

  const { bid_id } = await BidModel.create({
    customer_id,
    bid_amount: 1100,
    product_id
  }).then(response => response.$attributes)

  const bid = await makeBidUtil(BidModel).getById(bid_id, '')

  assert.isOk(bid)

  await UserModel.find(user_id).then(query => query.delete())
})

test('should return modified object of updated index form makeBidUtil.', async ({ assert }) => {
  const { user_id } = await makeUserUtil(UserModel)

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id)

  const { product_id } = await makeProductUtil(ProductModel, customer_id)

  const { bid_id } = await BidModel.create({
    customer_id,
    bid_amount: 1100,
    product_id
  }).then(response => response.$attributes)

  const { bid_amount } = await makeBidUtil(BidModel)
    .updateById(bid_id, { bid_amount: 1200 }, '')
    .then(response => response.$attributes)

  assert.equal(bid_amount, 1200)

  await UserModel.find(user_id).then(query => query.delete())
})

test('should return index of deleted index from makeBidUtil.', async ({ assert }) => {
  const { user_id } = await makeUserUtil(UserModel)

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id)

  const { product_id } = await makeProductUtil(ProductModel, customer_id)

  const { bid_id } = await BidModel.create({
    customer_id,
    bid_amount: 1100,
    product_id
  }).then(response => response.$attributes)

  const deletedBid = await makeBidUtil(BidModel).deleteById(bid_id)

  assert.isOk(deletedBid)

  await UserModel.find(user_id).then(query => query.delete())
})
