'use strict'

const makeUserUtil = require('../../util/testerUtil/autogenUserInstance.func')
const makeCustomerUtil = require('../../util/testerUtil/autogenCustomerInstance.func')
const makeCredentialRatingUtil = require('../../util/CredentialRatingUtil.func')
const makeProductUtil = require('../../util/testerUtil/autogenProductInstance.func')

const { test } = use('Test/Suite')('Credential Rating Detail Util')
const CredentialRatingModel = use('App/Models/CredentialRating')
const CustomerModel = use('App/Models/Customer')
const UserModel = use('App/Models/User')
const ProductModel = use('App/Models/Product')

test('should return empty array of rows from makeCredentialRatingUtil', async ({ assert }) => {
  const credentialRatings = await makeCredentialRatingUtil(CredentialRatingModel).getAll('')

  assert.equal(credentialRatings.rows.length, 0)
})

test('should return object of created index from makeCredentialRatingUtil.', async ({ assert }) => {
  const user = await makeUserUtil(UserModel)

  const customer = await makeCustomerUtil(CustomerModel, user.uuid)

  const product = await makeProductUtil(ProductModel, customer.uuid)

  const credentialRating = await makeCredentialRatingUtil(CredentialRatingModel).create({
    customer_uuid: customer.uuid,
    rating_score: 100,
    rating_description: 'someratingdescription',
    product_uuid: product.uuid
  })

  const { uuid } = credentialRating.toJSON()

  assert.isOk(uuid)

  await UserModel.find(user.uuid).then(query => query.delete())
})

test('should return array of row from makeCredentialRatingUtil.', async ({ assert }) => {
  const user = await makeUserUtil(UserModel)

  const customer = await makeCustomerUtil(CustomerModel, user.uuid)

  const product = await makeProductUtil(ProductModel, customer.uuid)

  await CredentialRatingModel.create({
    customer_uuid: customer.uuid,
    rating_score: 100,
    rating_description: 'someratingdescription',
    product_uuid: product.uuid
  })

  const credentialRatings = await makeCredentialRatingUtil(CredentialRatingModel).getAll('')

  assert.isAbove(credentialRatings.rows.length, 0)

  await UserModel.find(user.uuid).then(query => query.delete())
})

test('should return object of requested created index from makeCredentialRatingUtil.', async ({ assert }) => {
  const user = await makeUserUtil(UserModel)

  const customer = await makeCustomerUtil(CustomerModel, user.uuid)

  const product = await makeProductUtil(ProductModel, customer.uuid)

  const { uuid } = await CredentialRatingModel.create({
    customer_uuid: customer.uuid,
    rating_score: 100,
    rating_description: 'someratingdescription',
    product_uuid: product.uuid
  }).then(response => response.toJSON())

  const credentialRating = await makeCredentialRatingUtil(CredentialRatingModel).getById(uuid, '')

  assert.isOk(credentialRating)

  await UserModel.find(user.uuid).then(query => query.delete())
})

test('should return modified object of updated index form makeCredentialRatingUtil.', async ({ assert }) => {
  const user = await makeUserUtil(UserModel)

  const customer = await makeCustomerUtil(CustomerModel, user.uuid)

  const product = await makeProductUtil(ProductModel, customer.uuid)

  const { uuid } = await CredentialRatingModel.create({
    customer_uuid: customer.uuid,
    rating_score: 100,
    rating_description: 'someratingdescription',
    product_uuid: product.uuid
  }).then(response => response.toJSON())

  const credentialRating = await makeCredentialRatingUtil(CredentialRatingModel).updateById(uuid, { rating_description: 'a_new_description' }, '')

  assert.equal(
    credentialRating.toJSON().rating_description,
    'a_new_description'
  )

  await UserModel.find(user.uuid).then(query => query.delete())
})

test('should return index of deleted index from makeCredentialRatingUtil.', async ({ assert }) => {
  const user = await makeUserUtil(UserModel)

  const customer = await makeCustomerUtil(CustomerModel, user.uuid)

  const product = await makeProductUtil(ProductModel, customer.uuid)

  const { uuid } = await CredentialRatingModel.create({
    customer_uuid: customer.uuid,
    rating_score: 100,
    rating_description: 'someratingdescription',
    product_uuid: product.uuid
  }).then(response => response.toJSON())

  const deletedCredentialRating = await makeCredentialRatingUtil(CredentialRatingModel).deleteById(uuid)

  assert.isOk(deletedCredentialRating)

  await UserModel.find(user.uuid).then(query => query.delete())
})
