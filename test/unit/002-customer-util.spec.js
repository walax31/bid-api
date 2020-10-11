'use strict'

const makeUserUtil = require('../../util/testerUtil/autogenUserInstance.func')
const makeCustomerUtil = require('../../util/CustomerUtil.func')
const makeTestCustomerUtil = require('../../util/testerUtil/autogenCustomerInstance.func')

const { test } = use('Test/Suite')('Customer Detail Util')
const CustomerModel = use('App/Models/Customer')
const UserModel = use('App/Models/User')

test('should return empty array of rows from makeCustomerUtil', async ({ assert }) => {
  const customers = await makeCustomerUtil(CustomerModel).getAll('')

  assert.equal(customers.rows.length, 0)
})

test('should return object of created index from makeCustomerUtil.', async ({ assert }) => {
  const { uuid } = await makeUserUtil(UserModel)

  const customer = await makeCustomerUtil(CustomerModel)
    .create({
      user_uuid: uuid,
      first_name: 'first_name',
      last_name: 'last_name'
    })
    .then(response => response.toJSON())

  assert.isOk(customer.uuid)

  await UserModel.find(uuid).then(query => query.delete())
})

test('should return array of row from makeCustomerUtil.', async ({ assert }) => {
  const { uuid } = await makeUserUtil(UserModel)

  await makeTestCustomerUtil(CustomerModel, uuid)

  const customers = await makeCustomerUtil(CustomerModel).getAll('')

  assert.isAbove(customers.rows.length, 0)

  await UserModel.find(uuid).then(query => query.delete())
})

test('should return object of requested created index from makeCustomerUtil.', async ({ assert }) => {
  const { uuid } = await makeUserUtil(UserModel)

  const customer = await makeTestCustomerUtil(CustomerModel, uuid)

  assert.isOk(customer)

  await UserModel.find(uuid).then(query => query.delete())
})

test('should return modified object of updated index form makeCustomerUtil.', async ({ assert }) => {
  const user = await makeUserUtil(UserModel)

  const { uuid } = await makeTestCustomerUtil(CustomerModel, user.uuid)

  const customer = await makeCustomerUtil(CustomerModel).updateById(
    uuid,
    { first_name: 'new_first_name' },
    ''
  )

  assert.equal(customer.toJSON().first_name, 'new_first_name')

  await UserModel.find(user.uuid).then(query => query.delete())
})

test('should return index of deleted index from makeCustomerUtil.', async ({ assert }) => {
  const user = await makeUserUtil(UserModel)

  const { uuid } = await makeTestCustomerUtil(CustomerModel, user.uuid)

  const deletedCustomer = await makeCustomerUtil(CustomerModel).deleteById(uuid)

  assert.isOk(deletedCustomer)

  await UserModel.find(user.uuid).then(query => query.delete())
})
