'use strict'

const makeUserUtil = require('../../util/testerUtil/autogenUserInstance.func')
const makeCustomerUtil = require('../../util/testerUtil/autogenCustomerInstance.func')
const makeProductUtil = require('../../util/testerUtil/autogenProductInstance.func')
const makeProductDetailUtil = require('../../util/ProductDetailUtil.func')

const { test } = use('Test/Suite')('Product Detail Util')
const ProductDetailModel = use('App/Models/ProductDetail')
const ProductModel = use('App/Models/Product')
const CustomerModel = use('App/Models/Customer')
const UserModel = use('App/Models/User')

test('should return empty array of rows from makeProductDetailUtil', async ({ assert }) => {
  const productDetails = await makeProductDetailUtil(ProductDetailModel).getAll('')

  assert.equal(productDetails.rows.length, 0)
})

test('should return object of created index from makeProductDetailUtil.', async ({ assert }) => {
  const user = await makeUserUtil(UserModel)

  const customer = await makeCustomerUtil(CustomerModel, user.uuid)

  const product = await makeProductUtil(ProductModel, customer.uuid)

  const productDetail = await makeProductDetailUtil(ProductDetailModel).create({
    uuid: product.uuid,
    product_price: 1000,
    product_bid_start: 100,
    product_bid_increment: 100,
    product_description: 'a_product_description'
  })

  assert.isOk(productDetail)

  await UserModel.find(user.uuid).then(query => query.delete())
})

test('should return array of row from makeProductDetailUtil.', async ({ assert }) => {
  const user = await makeUserUtil(UserModel)

  const customer = await makeCustomerUtil(CustomerModel, user.uuid)

  const product = await makeProductUtil(ProductModel, customer.uuid)

  await ProductDetailModel.create({
    uuid: product.uuid,
    product_price: 1000,
    product_bid_start: 500,
    product_bid_increment: 100,
    product_description: 'a_product_description'
  })

  const productDetails = await makeProductDetailUtil(ProductDetailModel).getAll('')

  assert.isAbove(productDetails.rows.length, 0)

  await UserModel.find(user.uuid).then(query => query.delete())
})

test('should return object of requested created index from makeProductDetailUtil.', async ({ assert }) => {
  const user = await makeUserUtil(UserModel)

  const customer = await makeCustomerUtil(CustomerModel, user.uuid)

  const product = await makeProductUtil(ProductModel, customer.uuid)

  await ProductDetailModel.create({
    uuid: product.uuid,
    product_price: 1000,
    product_bid_start: 500,
    product_bid_increment: 100,
    product_description: 'a_product_description'
  })

  const productDetail = await makeProductDetailUtil(ProductDetailModel).getById(
    product.uuid,
    ''
  )

  assert.isOk(productDetail)

  await UserModel.find(user.uuid).then(query => query.delete())
})

test('should return modified object of updated index form makeProductDetailUtil.', async ({ assert }) => {
  const user = await makeUserUtil(UserModel)

  const customer = await makeCustomerUtil(CustomerModel, user.uuid)

  const product = await makeProductUtil(ProductModel, customer.uuid)

  await ProductDetailModel.create({
    uuid: product.uuid,
    product_price: 1000,
    product_bid_start: 500,
    product_bid_increment: 100,
    product_description: 'a_product_description'
  })

  const { product_description } = await makeProductDetailUtil(ProductDetailModel)
    .updateById(
      product.uuid,
      { product_description: 'a_new_product_description' },
      ''
    )
    .then(response => response.toJSON())

  assert.equal(product_description, 'a_new_product_description')

  await UserModel.find(user.uuid).then(query => query.delete())
})

test('should return index of deleted index from makeProductDetailUtil.', async ({ assert }) => {
  const user = await makeUserUtil(UserModel)

  const customer = await makeCustomerUtil(CustomerModel, user.uuid)

  const { uuid } = await makeProductUtil(ProductModel, customer.uuid)

  await ProductDetailModel.create({
    uuid,
    product_price: 1000,
    product_bid_start: 500,
    product_bid_increment: 100,
    product_description: 'a_product_description'
  })

  const deletedProductDetail = await makeProductDetailUtil(ProductDetailModel).deleteById(uuid)

  assert.isOk(deletedProductDetail)

  await UserModel.find(user.uuid).then(query => query.delete())
})
