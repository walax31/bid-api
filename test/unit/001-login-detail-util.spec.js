'use strict'

const makeUserUtil = require('../../util/UserUtil.func')
const makeTestUserUtil = require('../../util/testerUtil/autogenUserInstance.func')

const { test } = use('Test/Suite')('Login Detail Util')

const UserModel = use('App/Models/User')

test('should return empty array of rows from makeUserUtil', async ({ assert }) => {
  const users = await makeUserUtil(UserModel).getAll('')

  assert.equal(users.rows.length, 0)
})

test('should return object of created index from makeUserUtil.', async ({ assert }) => {
  const user = await makeUserUtil(UserModel).create({
    username: 'username',
    password: 'password',
    email: 'example@domain.host'
  })

  const { user_id } = user.$attributes

  assert.isOk(user_id)

  await UserModel.find(user_id).then(query => query.delete())
})

test('should return array of row from makeUserUtil.', async ({ assert }) => {
  const { user_id } = await makeTestUserUtil(UserModel)

  const users = await makeUserUtil(UserModel).getAll('')

  assert.isAbove(users.rows.length, 0)

  await UserModel.find(user_id).then(query => query.delete())
})

test('should return object of requested created index from makeUserUtil.', async ({ assert }) => {
  const { user_id } = await makeTestUserUtil(UserModel)

  const user = await makeUserUtil(UserModel).getById(user_id, '')

  assert.isOk(user)

  await UserModel.find(user_id).then(query => query.delete())
})

test('should return modified object of updated index form makeUserUtil.', async ({ assert }) => {
  const { user_id } = await makeTestUserUtil(UserModel)

  const { username } = await makeUserUtil(UserModel)
    .updateById(user_id, { username: 'a_new_username' }, '')
    .then(response => response.$attributes)

  assert.equal(username, 'a_new_username')

  await UserModel.find(user_id).then(query => query.delete())
})

test('should return index of deleted index from makeUserUtil.', async ({ assert }) => {
  const { user_id } = await makeTestUserUtil(UserModel)

  const deletedUser = await makeUserUtil(UserModel).deleteById(user_id)

  assert.isOk(deletedUser)
})
