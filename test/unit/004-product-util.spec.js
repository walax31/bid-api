'use strict'

const makeUserUtil = require('../../util/testerUtil/autogenUserInstance.func')
const makeCustomerUtil = require('../../util/testerUtil/autogenCustomerInstance.func')
const makeProductUtil = require('../../util/ProductUtil.func')
const makeTestProductUtil = require('../../util/testerUtil/autogenProductInstance.func')

const { test } = use('Test/Suite')('Product Util')
const ProductModel = use('App/Models/Product')
const CustomerModel = use('App/Models/Customer')
const UserModel = use('App/Models/User')

test('should return empty array of rows from makeProductUtil', async ({ assert }) => {
  const products = await makeProductUtil(ProductModel).getAll('')

  assert.equal(products.rows.length, 0)
})

test('should return object of created index from makeProductUtil.', async ({ assert }) => {
  const user = await makeUserUtil(UserModel)

  const customer = await makeCustomerUtil(CustomerModel, user.uuid)

  const product = await makeProductUtil(ProductModel)
    .create({
      customer_uuid: customer.uuid,
      product_name: 'product_name',
      stock: 10
    })
    .then(response => response.toJSON())

  assert.isOk(product.uuid)

  await UserModel.find(user.uuid).then(query => query.delete())
})

test('should return array of row from makeProductUtil.', async ({ assert }) => {
  const user = await makeUserUtil(UserModel)

  const customer = await makeCustomerUtil(CustomerModel, user.uuid)

  await makeTestProductUtil(ProductModel, customer.uuid)

  const products = await makeProductUtil(ProductModel).getAll('')

  assert.isAbove(products.rows.length, 0)

  await UserModel.find(user.uuid).then(query => query.delete())
})

test('should return object of requested created index from makeProductUtil.', async ({ assert }) => {
  const user = await makeUserUtil(UserModel)

  const customer = await makeCustomerUtil(CustomerModel, user.uuid)

  const { uuid } = await makeTestProductUtil(ProductModel, customer.uuid)

  const product = await makeProductUtil(ProductModel).getById(uuid, '')

  assert.isOk(product)

  await UserModel.find(user.uuid).then(query => query.delete())
})

test('should return modified object of updated index form makeProductUtil.', async ({ assert }) => {
  const user = await makeUserUtil(UserModel)

  const customer = await makeCustomerUtil(CustomerModel, user.uuid)

  const { uuid } = await makeTestProductUtil(ProductModel, customer.uuid)

  const { stock } = await makeProductUtil(ProductModel)
    .updateById(uuid, { stock: 20 }, '')
    .then(response => response.toJSON())

  assert.equal(stock, 20)

  await UserModel.find(user.uuid).then(query => query.delete())
})

test('should return index of deleted index from makeProductUtil.', async ({ assert }) => {
  const user = await makeUserUtil(UserModel)

  const customer = await makeCustomerUtil(CustomerModel, user.uuid)

  const { uuid } = await makeTestProductUtil(ProductModel, customer.uuid)

  const deletedProduct = await makeProductUtil(ProductModel).deleteById(uuid)

  assert.isOk(deletedProduct)

  await UserModel.find(user.uuid).then(query => query.delete())
})
