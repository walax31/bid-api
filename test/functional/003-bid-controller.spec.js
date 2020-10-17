'use strict'

const makeTesterUserUtil = require('../../util/testerUtil/autogenUserInstance.func')
const makeTesterCustomerUtil = require('../../util/testerUtil/autogenCustomerInstance.func')
const makeTesterProductUtil = require('../../util/testerUtil/autogenProductInstance.func')
const makeTesterProductDetailUtil = require('../../util/testerUtil/autogenProductDetailInstance.func')
const makeTesterAdminUtil = require('../../util/testerUtil/autogenAdminInstance.func')
const makeTesterBidUtil = require('../../util/testerUtil/autogenBidInstance.func')

const { test, trait } = use('Test/Suite')('Bid Controller endpoint testing')
const ProductDetailModel = use('App/Models/ProductDetail')
const BidModel = use('App/Models/Bid')
const UserModel = use('App/Models/User')
const CustomerModel = use('App/Models/Customer')
const ProductModel = use('App/Models/Product')

trait('Test/ApiClient')
trait('Auth/Client')

const urlEndPoint = '/api/v1/bids'

test('should return structured response with empty data array via get method.', async ({ client }) => {
  const admin = await makeTesterAdminUtil(UserModel)

  const response = await client.get(urlEndPoint).loginVia(admin, 'jwt').end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: [] })

  await UserModel.find(admin.uuid).then(query => query.delete())
})

test('should return structured response with empty data via get method.', async ({ client }) => {
  const admin = await makeTesterAdminUtil(UserModel)

  const response = await client
    .get(`${urlEndPoint}/1`)
    .loginVia(admin, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: {} })

  await UserModel.find(admin.uuid).then(query => query.delete())
})

test('should return error message and status code of 400 when field data is missing.', async ({ client }) => {
  const user = await makeTesterUserUtil(UserModel)

  const customer = await makeTesterCustomerUtil(CustomerModel, user.uuid, true)

  const product = await makeTesterProductUtil(ProductModel, customer.uuid)

  const bid = { product_uuid: product.uuid }

  const response = await client
    .post(urlEndPoint)
    .loginVia(user, 'jwt')
    .send(bid)
    .end()

  response.assertStatus(400)

  await UserModel.find(user.uuid).then(query => query.delete())
})

test('should return structured response with no references in an array via get method.', async ({ client }) => {
  const user = await makeTesterUserUtil(UserModel)

  const customer = await makeTesterCustomerUtil(CustomerModel, user.uuid, true)

  const product = await makeTesterProductUtil(ProductModel, customer.uuid)

  const bid = await BidModel.create({
    customer_uuid: customer.uuid,
    bid_amount: 1000,
    product_uuid: product.uuid
  })

  const response = await client.get(urlEndPoint).loginVia(user, 'jwt').end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: [bid.toJSON()] })

  await UserModel.find(user.uuid).then(query => query.delete())
})

test('should return structured response with references in an array via get method.', async ({ client }) => {
  const user = await makeTesterUserUtil(UserModel)

  const customer = await makeTesterCustomerUtil(CustomerModel, user.uuid, true)

  const product = await makeTesterProductUtil(ProductModel, customer.uuid)

  await BidModel.create({
    customer_uuid: customer.uuid,
    bid_amount: 1000,
    product_uuid: product.uuid
  })

  const response = await client
    .get(urlEndPoint)
    .loginVia(user, 'jwt')
    .query({ references: 'customer,product' })
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    data: [
      {
        customer: { uuid: customer.uuid },
        product: { uuid: product.uuid }
      }
    ]
  })

  await UserModel.find(user.uuid).then(query => query.delete())
})

test('should return structured response with no references via get method.', async ({ client }) => {
  const user = await makeTesterUserUtil(UserModel)

  const customer = await makeTesterCustomerUtil(CustomerModel, user.uuid, true)

  const product = await makeTesterProductUtil(ProductModel, customer.uuid)

  const bid = await BidModel.create({
    customer_uuid: customer.uuid,
    bid_amount: 2000,
    product_uuid: product.uuid
  })

  const response = await client
    .get(`${urlEndPoint}/${bid.toJSON().uuid}`)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: bid.toJSON() })

  await UserModel.find(user.uuid).then(query => query.delete())
})

test('should return structured response with references via get method.', async ({ client }) => {
  const user = await makeTesterUserUtil(UserModel)

  const customer = await makeTesterCustomerUtil(CustomerModel, user.uuid, true)

  const product = await makeTesterProductUtil(ProductModel, customer.uuid)

  const bid = await BidModel.create({
    customer_uuid: customer.uuid,
    bid_amount: 1000,
    product_uuid: product.uuid
  })

  const response = await client
    .get(`${urlEndPoint}/${bid.toJSON().uuid}`)
    .loginVia(user, 'jwt')
    .query({ references: 'customer,product' })
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    data: {
      customer: { uuid: customer.uuid },
      product: { uuid: product.uuid }
    }
  })

  await UserModel.find(user.uuid).then(query => query.delete())
})

test('should return structured data with no references via post method.', async ({ client }) => {
  const user = await makeTesterUserUtil(UserModel)

  const customer = await makeTesterCustomerUtil(CustomerModel, user.uuid, true)

  const product = await makeTesterProductUtil(ProductModel, customer.uuid)

  await makeTesterProductDetailUtil(ProductDetailModel, product.uuid)

  await makeTesterBidUtil(BidModel, customer.uuid, product.uuid, 1000)
  await makeTesterBidUtil(BidModel, customer.uuid, product.uuid, 1100)

  const bid = {
    bid_amount: 1200,
    product_uuid: product.uuid
  }

  const response = await client
    .post(urlEndPoint)
    .loginVia(user, 'jwt')
    .send(bid)
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: bid })

  await UserModel.find(user.uuid).then(query => query.delete())
})

test('should return structured data with references via post method.', async ({ client }) => {
  const user = await makeTesterUserUtil(UserModel)

  const customer = await makeTesterCustomerUtil(CustomerModel, user.uuid, true)

  const product = await makeTesterProductUtil(ProductModel, customer.uuid)

  await makeTesterProductDetailUtil(ProductDetailModel, product.uuid)

  const bid = {
    bid_amount: 1100,
    product_uuid: product.uuid
  }

  const response = await client
    .post(urlEndPoint)
    .loginVia(user, 'jwt')
    .send(bid)
    .query({ references: 'customer,product' })
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    data: {
      customer: { uuid: customer.uuid },
      product: { uuid: product.uuid }
    }
  })

  await UserModel.find(user.uuid).then(query => query.delete())
})

test('should return structured data with no references via put method.', async ({ client }) => {
  const user = await makeTesterUserUtil(UserModel)

  const admin = await makeTesterAdminUtil(UserModel)

  const customer = await makeTesterCustomerUtil(CustomerModel, user.uuid, true)

  const product = await makeTesterProductUtil(ProductModel, customer.uuid)

  await makeTesterProductDetailUtil(ProductDetailModel, product.uuid)

  const bid = await BidModel.create({
    customer_uuid: customer.uuid,
    bid_amount: 1000,
    product_uuid: product.uuid
  })

  const response = await client
    .put(`${urlEndPoint}/${bid.toJSON().uuid}`)
    .loginVia(admin, 'jwt')
    .send({ bid_amount: 1100 })
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: { bid_amount: 1100 } })
  await UserModel.find(admin.uuid).then(query => query.delete())
  await UserModel.find(user.uuid).then(query => query.delete())
})

test('should return structured data with references via put method.', async ({ client }) => {
  const admin = await makeTesterAdminUtil(UserModel)

  const user = await makeTesterUserUtil(UserModel)

  const customer = await makeTesterCustomerUtil(CustomerModel, user.uuid, true)

  const product = await makeTesterProductUtil(ProductModel, customer.uuid)

  await makeTesterProductDetailUtil(ProductDetailModel, product.uuid)

  const bid = await BidModel.create({
    customer_uuid: customer.uuid,
    bid_amount: 1000,
    product_uuid: product.uuid
  }).then(response => response.toJSON())

  const response = await client
    .put(`${urlEndPoint}/${bid.uuid}`)
    .loginVia(admin, 'jwt')
    .send({ bid_amount: 1100 })
    .query({ references: 'customer,product' })
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    data: {
      bid_amount: 1100,
      customer: { uuid: customer.uuid },
      product: { uuid: product.uuid }
    }
  })

  await UserModel.find(admin.uuid).then(query => query.delete())
  await UserModel.find(user.uuid).then(query => query.delete())
})

test('should return data index via delete method.', async ({ client }) => {
  const admin = await makeTesterAdminUtil(UserModel)

  const user = await makeTesterUserUtil(UserModel)

  const customer = await makeTesterCustomerUtil(CustomerModel, user.uuid, true)

  const product = await makeTesterProductUtil(ProductModel, customer.uuid)

  await makeTesterProductDetailUtil(ProductDetailModel, product.uuid)

  const bid = await BidModel.create({
    customer_uuid: customer.uuid,
    bid_amount: 1000,
    product_uuid: product.uuid
  })

  const response = await client
    .delete(`${urlEndPoint}/${bid.toJSON().uuid}`)
    .loginVia(admin, 'jwt')
    .end()

  response.assertStatus(200)

  await UserModel.find(user.uuid).then(query => query.delete())
  await UserModel.find(admin.uuid).then(query => query.delete())
})
