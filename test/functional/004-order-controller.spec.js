'use strict'

const makeBidUtil = require('../../util/testerUtil/autogenBidInstance.func')
const makeUserUtil = require('../../util/testerUtil/autogenUserInstance.func')
const makeCustomerUtil = require('../../util/testerUtil/autogenCustomerInstance.func')
const makeProductUtil = require('../../util/testerUtil/autogenProductInstance.func')
const makeOrderUtil = require('../../util/testerUtil/autogenOrderInstance.func')
const makeAdminUtil = require('../../util/testerUtil/autogenAdminInstance.func')

const { test, trait } = use('Test/Suite')('Oder Controller')
const BidModel = use('App/Models/Bid')
const OrderModel = use('App/Models/Order')
const UserModel = use('App/Models/User')
const CustomerModel = use('App/Models/Customer')
const ProductModel = use('App/Models/Product')

trait('Test/ApiClient')
trait('Auth/Client')

const urlEndPoint = '/api/v1/orders'

test('should return structured response with empty data array via get method.', async ({ client }) => {
  const admin = await makeAdminUtil(UserModel)

  const response = await client.get(urlEndPoint).loginVia(admin, 'jwt').end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: [] })

  await UserModel.find(admin.uuid).then(query => query.delete())
})

test('should return structured response with empty data via get method.', async ({ client }) => {
  const admin = await makeAdminUtil(UserModel)

  const response = await client
    .get(`${urlEndPoint}/1`)
    .loginVia(admin, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: {} })

  await UserModel.find(admin.uuid).then(query => query.delete())
})

test('should return error message and status code of 400 when field data is missing.', async ({ client }) => {
  const user1 = await makeUserUtil(UserModel)

  const user2 = await UserModel.create({
    username: 'wada',
    email: 'waddda@gmail.com',
    password: '1233131231'
  }).then(response => response.toJSON())

  const customer1 = await makeCustomerUtil(CustomerModel, user1.uuid, true)

  const customer2 = await CustomerModel.create({
    user_uuid: user2.uuid,
    first_name: 'dfsfss',
    last_name: 'daad',
    is_validated: true
  })

  const product = await makeProductUtil(ProductModel, customer1.uuid)

  await makeBidUtil(BidModel, customer2.uuid, product.uuid)

  const order = {
    product_uuid: product.uuid,
    customer_uuid: customer2.uuid
  }

  const response = await client
    .post(urlEndPoint)
    .loginVia(user1, 'jwt')
    .send(order)
    .end()

  response.assertStatus(400)

  await UserModel.find(user1.uuid).then(query => query.delete())
  await UserModel.find(user2.uuid).then(query => query.delete())
})

test('should return structured response with no references in an array via get method.', async ({ client }) => {
  const user1 = await makeUserUtil(UserModel)

  const user2 = await UserModel.create({
    username: 'wada',
    email: 'waddda@gmail.com',
    password: '1233131231'
  }).then(response => response.toJSON())

  const customer1 = await makeCustomerUtil(CustomerModel, user1.uuid, true)

  const customer2 = await CustomerModel.create({
    user_uuid: user2.uuid,
    first_name: 'dfsfss',
    last_name: 'daad',
    is_validated: true
  })

  const product = await makeProductUtil(ProductModel, customer1.uuid)

  await makeBidUtil(BidModel, customer2.uuid, product.uuid)

  const order = await makeOrderUtil(OrderModel, customer2.uuid, product.uuid)

  const response = await client.get(urlEndPoint).loginVia(user2, 'jwt').end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: [order] })

  await UserModel.find(user1.uuid).then(query => query.delete())
  await UserModel.find(user2.uuid).then(query => query.delete())
})

test('should return structured response with references in an array via get method.', async ({ client }) => {
  const user1 = await makeUserUtil(UserModel)

  const user2 = await UserModel.create({
    username: 'wada',
    email: 'waddda@gmail.com',
    password: '1233131231'
  }).then(response => response.toJSON())

  const customer1 = await makeCustomerUtil(CustomerModel, user1.uuid, true)

  const customer2 = await CustomerModel.create({
    user_uuid: user2.uuid,
    first_name: 'dfsfss',
    last_name: 'daad',
    is_validated: true
  })

  const product = await makeProductUtil(ProductModel, customer1.uuid)

  await makeBidUtil(BidModel, customer2.uuid, product.uuid)

  await makeOrderUtil(OrderModel, customer2.uuid, product.uuid)

  const response = await client
    .get(urlEndPoint)
    .loginVia(user2, 'jwt')
    .query({ references: 'customer,product' })
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    data: [
      {
        customer: { uuid: customer2.uuid },
        product: { uuid: product.uuid }
      }
    ]
  })

  await UserModel.find(user1.uuid).then(query => query.delete())
  await UserModel.find(user2.uuid).then(query => query.delete())
})

test('should return structured response with no references via get method.', async ({ client }) => {
  const user1 = await makeUserUtil(UserModel)

  const user2 = await UserModel.create({
    username: 'wada',
    email: 'waddda@gmail.com',
    password: '1233131231'
  }).then(response => response.toJSON())

  const customer1 = await makeCustomerUtil(CustomerModel, user1.uuid, true)

  const customer2 = await CustomerModel.create({
    user_uuid: user2.uuid,
    first_name: 'dfsfss',
    last_name: 'daad',
    is_validated: true
  })

  const product = await makeProductUtil(ProductModel, customer1.uuid)
  await makeBidUtil(BidModel, customer2.uuid, product.uuid)

  const order = await makeOrderUtil(OrderModel, customer2.uuid, product.uuid)

  const response = await client
    .get(`${urlEndPoint}/${order.uuid}`)
    .loginVia(user2)
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: order })

  await UserModel.find(user1.uuid).then(query => query.delete())
  await UserModel.find(user2.uuid).then(query => query.delete())
})

test('should return structured response with references via get method.', async ({ client }) => {
  const user1 = await makeUserUtil(UserModel)

  const user2 = await UserModel.create({
    username: 'wada',
    email: 'waddda@gmail.com',
    password: '1233131231'
  }).then(response => response.toJSON())

  const customer1 = await makeCustomerUtil(CustomerModel, user1.uuid, true)

  const customer2 = await CustomerModel.create({
    user_uuid: user2.uuid,
    first_name: 'dfsfss',
    last_name: 'daad',
    is_validated: true
  })

  const product = await makeProductUtil(ProductModel, customer1.uuid)

  await makeBidUtil(BidModel, customer2.uuid, product.uuid)

  const order = await makeOrderUtil(OrderModel, customer2.uuid, product.uuid)

  const response = await client
    .get(`${urlEndPoint}/${order.uuid}`)
    .loginVia(user2, 'jwt')
    .query({ references: 'customer,product' })
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    data: {
      customer: { uuid: customer2.uuid },
      product: { uuid: product.uuid }
    }
  })

  await UserModel.find(user1.uuid).then(query => query.delete())
  await UserModel.find(user2.uuid).then(query => query.delete())
})

test('should return structured data with no references via post method.', async ({ client }) => {
  const user1 = await makeUserUtil(UserModel)

  const user2 = await UserModel.create({
    username: 'wada',
    email: 'waddda@gmail.com',
    password: '1233131231'
  }).then(response => response.toJSON())

  const customer1 = await makeCustomerUtil(CustomerModel, user1.uuid, true)

  const customer2 = await CustomerModel.create({
    user_uuid: user2.uuid,
    first_name: 'dfsfss',
    last_name: 'daad',
    is_validated: true
  })

  const product = await makeProductUtil(ProductModel, customer1.uuid)

  await makeBidUtil(BidModel, customer2.uuid, product.uuid)

  const order = {
    order_quantity: 1,
    customer_uuid: customer2.uuid,
    product_uuid: product.uuid
  }

  const response = await client
    .post(urlEndPoint)
    .loginVia(user1, 'jwt')
    .send(order)
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: order })

  await UserModel.find(user1.uuid).then(query => query.delete())
  await UserModel.find(user2.uuid).then(query => query.delete())
})

test('should return structured data with references via post method.', async ({ client }) => {
  const user1 = await makeUserUtil(UserModel)

  const user2 = await UserModel.create({
    username: 'wada',
    email: 'waddda@gmail.com',
    password: '1233131231'
  }).then(response => response.toJSON())

  const customer1 = await makeCustomerUtil(CustomerModel, user1.uuid, true)

  const customer2 = await CustomerModel.create({
    user_uuid: user2.uuid,
    first_name: 'dfsfss',
    last_name: 'daad',
    is_validated: true
  })

  const product = await makeProductUtil(ProductModel, customer1.uuid)

  await makeBidUtil(BidModel, customer2.uuid, product.uuid)

  const order = {
    order_quantity: 1,
    customer_uuid: customer2.uuid,
    product_uuid: product.uuid
  }

  const response = await client
    .post(urlEndPoint)
    .loginVia(user1, 'jwt')
    .send(order)
    .query({ references: 'customer,product' })
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    data: {
      uuid: response.body.data.uuid,
      customer: { uuid: customer2.uuid },
      product: { uuid: product.uuid }
    }
  })

  await UserModel.find(user1.uuid).then(query => query.delete())
  await UserModel.find(user2.uuid).then(query => query.delete())
})

test('should return structured data with no references via put method.', async ({ client }) => {
  const admin = await makeAdminUtil(UserModel)

  const user1 = await makeUserUtil(UserModel)

  const user2 = await UserModel.create({
    username: 'wada',
    email: 'waddda@gmail.com',
    password: '1233131231'
  }).then(response => response.toJSON())

  const customer1 = await makeCustomerUtil(CustomerModel, user1.uuid, true)

  const customer2 = await CustomerModel.create({
    user_uuid: user2.uuid,
    first_name: 'dfsfss',
    last_name: 'daad',
    is_validated: true
  })

  const product = await makeProductUtil(ProductModel, customer1.uuid)

  await makeBidUtil(BidModel, customer2.uuid, product.uuid)

  const order = await makeOrderUtil(OrderModel, customer2.uuid, product.uuid)

  const response = await client
    .put(`${urlEndPoint}/${order.uuid}`)
    .loginVia(admin, 'jwt')
    .send({ order_quantity: 1 })
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: { order_quantity: 1 } })

  await UserModel.find(user1.uuid).then(query => query.delete())
  await UserModel.find(user2.uuid).then(query => query.delete())
  await UserModel.find(admin.uuid).then(query => query.delete())
})

test('should return structured data with references via put method.', async ({ client }) => {
  const admin = await makeAdminUtil(UserModel)

  const user1 = await makeUserUtil(UserModel)

  const user2 = await UserModel.create({
    username: 'wada',
    email: 'waddda@gmail.com',
    password: '1233131231'
  }).then(response => response.toJSON())

  const customer1 = await makeCustomerUtil(CustomerModel, user1.uuid, true)

  const customer2 = await CustomerModel.create({
    user_uuid: user2.uuid,
    first_name: 'dfsfss',
    last_name: 'daad',
    is_validated: true
  })

  const product = await makeProductUtil(ProductModel, customer1.uuid)

  await makeBidUtil(BidModel, customer2.uuid, product.uuid)

  const order = await makeOrderUtil(OrderModel, customer2.uuid, product.uuid)

  const response = await client
    .put(`${urlEndPoint}/${order.uuid}`)
    .loginVia(admin, 'jwt')
    .send({ order_quantity: 1 })
    .query({ references: 'customer,product' })
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    data: {
      order_quantity: 1,
      customer: { uuid: customer2.uuid },
      product: { uuid: product.uuid }
    }
  })

  await UserModel.find(admin.uuid).then(query => query.delete())
  await UserModel.find(user1.uuid).then(query => query.delete())
  await UserModel.find(user2.uuid).then(query => query.delete())
})

test('should return data index via delete method.', async ({ client }) => {
  const admin = await makeAdminUtil(UserModel)

  const user1 = await makeUserUtil(UserModel)

  const user2 = await UserModel.create({
    username: 'wada',
    email: 'waddda@gmail.com',
    password: '1233131231'
  }).then(response => response.toJSON())

  const customer1 = await makeCustomerUtil(CustomerModel, user1.uuid, true)

  const customer2 = await CustomerModel.create({
    user_uuid: user2.uuid,
    first_name: 'dfsfss',
    last_name: 'daad',
    is_validated: true
  })

  const product = await makeProductUtil(ProductModel, customer1.uuid)

  await makeBidUtil(BidModel, customer2.uuid, product.uuid)

  const order = await makeOrderUtil(OrderModel, customer2.uuid, product.uuid)

  const response = await client
    .delete(`${urlEndPoint}/${order.uuid}`)
    .loginVia(admin, 'jwt')
    .end()

  response.assertStatus(200)

  await UserModel.find(user1.uuid).then(query => query.delete())
  await UserModel.find(user2.uuid).then(query => query.delete())
  await UserModel.find(admin.uuid).then(query => query.delete())
})
