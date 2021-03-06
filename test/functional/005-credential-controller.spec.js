'use strict'

const makeTestUserUtil = require('../../util/testerUtil/autogenUserInstance.func')

const TokenModel = use('App/Models/Token')
const { test, trait } = use('Test/Suite')('Credential Controller')
const UserModel = use('App/Models/User')

trait('Test/ApiClient')
trait('Auth/Client')

test('should return token upon login.', async ({ client, assert }) => {
  const { username, uuid } = await makeTestUserUtil(UserModel)

  const response = await client
    .post('/api/v1/login')
    .send({ username, password: 'password' })
    .end()

  response.assertStatus(200)
  assert.isOk(response.body.tokens.token)

  await UserModel.find(uuid).then(query => query.delete())
})

test('should be able to perform authenticated action.', async ({ client }) => {
  const user = await makeTestUserUtil(UserModel)

  const response = await client
    .get(`/api/v1/users/${user.uuid}`)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: { uuid: user.uuid } })

  await UserModel.find(user.uuid).then(query => query.delete())
})

test('should return a new pair of tokens.', async ({ client, assert }) => {
  const { username, uuid } = await makeTestUserUtil(UserModel)

  const response = await client
    .post('/api/v1/login')
    .send({ username, password: 'password' })
    .end()

  response.assertStatus(200)
  assert.isOk(response.body.tokens.refreshToken)

  const nextResponse = await client
    .post('/api/v1/authenticate')
    .header('refreshToken', response.body.tokens.refreshToken)
    .end()

  nextResponse.assertStatus(200)
  assert.isOk(nextResponse.body.tokens.token)

  await UserModel.find(uuid).then(query => query.delete())
})

test('should be able to logout.', async ({ client, assert }) => {
  const user = await makeTestUserUtil(UserModel)

  const response = await client
    .post('/api/v1/login')
    .send({ username: user.username, password: 'password' })
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({ error: undefined })

  const nextResponse = await client
    .get('/api/v1/logout')
    .loginVia(user, 'jwt')
    .header('refreshToken', response.body.tokens.refreshToken)
    .end()

  nextResponse.assertStatus(200)
  nextResponse.assertJSONSubset({ error: undefined })

  const { is_revoked } = await TokenModel.all().then(query =>
    query.first().toJSON())

  assert.equal(is_revoked, 1)

  await UserModel.find(user.uuid).then(query => query.delete())
})
