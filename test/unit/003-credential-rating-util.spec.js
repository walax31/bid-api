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
  const { user_id } = await makeUserUtil(UserModel)

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id)

  const { product_id } = await makeProductUtil(ProductModel, customer_id)

  const credentialRating = await makeCredentialRatingUtil(CredentialRatingModel).create({
    customer_id,
    rating_score: 100,
    rating_description: 'someratingdescription',
    product_id
  })

  const { credential_rating_id } = credentialRating.$attributes

  assert.isOk(credential_rating_id)

  await UserModel.find(user_id).then(query => query.delete())
})

test('should return array of row from makeCredentialRatingUtil.', async ({ assert }) => {
  const { user_id } = await makeUserUtil(UserModel)

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id)

  const { product_id } = await makeProductUtil(ProductModel, customer_id)

  await CredentialRatingModel.create({
    customer_id,
    rating_score: 100,
    rating_description: 'someratingdescription',
    product_id
  })

  const credentialRatings = await makeCredentialRatingUtil(CredentialRatingModel).getAll('')

  assert.isAbove(credentialRatings.rows.length, 0)

  await UserModel.find(user_id).then(query => query.delete())
})

test('should return object of requested created index from makeCredentialRatingUtil.', async ({ assert }) => {
  const { user_id } = await makeUserUtil(UserModel)

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id)

  const { product_id } = await makeProductUtil(ProductModel, customer_id)

  const { credential_rating_id } = await CredentialRatingModel.create({
    customer_id,
    rating_score: 100,
    rating_description: 'someratingdescription',
    product_id
  }).then(response => response.$attributes)

  const credentialRating = await makeCredentialRatingUtil(CredentialRatingModel).getById(credential_rating_id, '')

  assert.isOk(credentialRating)

  await UserModel.find(user_id).then(query => query.delete())
})

test('should return modified object of updated index form makeCredentialRatingUtil.', async ({ assert }) => {
  const { user_id } = await makeUserUtil(UserModel)

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id)

  const { product_id } = await makeProductUtil(ProductModel, customer_id)

  const { credential_rating_id } = await CredentialRatingModel.create({
    customer_id,
    rating_score: 100,
    rating_description: 'someratingdescription',
    product_id
  }).then(response => response.$attributes)

  const credentialRating = await makeCredentialRatingUtil(CredentialRatingModel).updateById(
    credential_rating_id,
    { rating_description: 'a_new_description' },
    ''
  )

  assert.equal(
    credentialRating.$attributes.rating_description,
    'a_new_description'
  )

  await UserModel.find(user_id).then(query => query.delete())
})

test('should return index of deleted index from makeCredentialRatingUtil.', async ({ assert }) => {
  const { user_id } = await makeUserUtil(UserModel)

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id)

  const { product_id } = await makeProductUtil(ProductModel, customer_id)

  const { credential_rating_id } = await CredentialRatingModel.create({
    customer_id,
    rating_score: 100,
    rating_description: 'someratingdescription',
    product_id
  }).then(response => response.$attributes)

  const deletedCredentialRating = await makeCredentialRatingUtil(CredentialRatingModel).deleteById(credential_rating_id)

  assert.isOk(deletedCredentialRating)

  await UserModel.find(user_id).then(query => query.delete())
})
