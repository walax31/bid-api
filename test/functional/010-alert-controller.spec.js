'use strict'

const makeTesterAlertUtil = require('../../util/testerUtil/autogenAlertInstance.func')
const makeTesterUserUtil = require('../../util/testerUtil/autogenUserInstance.func')
const makeTesterAdminUtil = require('../../util/testerUtil/autogenAdminInstance.func')
const makeTesterCustomerUtil = require('../../util/testerUtil/autogenCustomerInstance.func')

const { test, trait } = use('Test/Suite')('Alert Controller')
const AlertModel = use('App/Models/Alert')
const UserModel = use('App/Models/User')
const CustomerModel = use('App/Models/Customer')

trait('Test/ApiClient')
trait('Auth/Client')

const API_ENDPOINT = '/api/v1/alerts'

/* Route config
 * index (customer,admin)
 * show (customer,admin)
 * store (customer,admin) (strict)
 * update (customer,admin) (strict)
 * destroy (admin)
 * */

/* Test cases
 * 1. get (empty)
 * 2. get/id (empty)
 * 3. get (no-ref)
 * 4. get (ref)
 * 5. get/id (no-ref)
 * 6. get/id (ref)
 * 7. post (error)
 * 8. post (no-ref)
 * 9. post (ref)
 * 10. put (no-ref)
 * 11. put (ref)
 * 12. delete
 * */

const ALERT_ATTRIBUTE = {
  type: 'bid',
  content: 'Your bid has been overbid by someone.',
  reference: 'product-uuid'
}

async function cleanUp (alert) {
  await AlertModel.find(alert.uuid).then(query => query.delete())
}

async function cleanUpUser (user) {
  await UserModel.find(user.uuid).then(query => query.delete())
}

// 1. get (empty)
test('should return structured response with empty array via get method.', async ({ client }) => {
  const user = await makeTesterUserUtil(UserModel)

  const response = await client.get(API_ENDPOINT).loginVia(user, 'jwt').end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: [] })

  await cleanUpUser(user)
})

// 2. get/id (empty)
test('should return structured response with empty data via get method.', async ({ client }) => {
  const user = await makeTesterUserUtil(UserModel)

  const response = await client.get(API_ENDPOINT).loginVia(user, 'jwt').end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: {} })

  await cleanUpUser(user)
})

// 3. get (no-ref)
test('should return structured response with no references in an array via get method.', async ({ client }) => {
  const user = await makeTesterUserUtil(UserModel)

  const alert = await makeTesterAlertUtil(AlertModel, user.uuid)

  const response = await client.get(API_ENDPOINT).loginVia(user, 'jwt').end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: [alert] })

  await cleanUp(alert)
  await cleanUpUser(user)
})

// 4. get (ref)
test('should return structured response with references in an array via get method.', async ({ client }) => {
  const user = await makeTesterUserUtil(UserModel)

  const alert = await makeTesterAlertUtil(AlertModel, user.uuid)

  const response = await client
    .get(API_ENDPOINT)
    .loginVia(user, 'jwt')
    .query({ references: 'user' })
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: [{ ...alert, user: { uuid: user.uuid } }] })

  await cleanUp(alert)
  await cleanUpUser(user)
})

// 5. get/id (no-ref)
test('should return structured response with no references via get method.', async ({ client }) => {
  const user = await makeTesterUserUtil(UserModel)

  const alert = await makeTesterAlertUtil(AlertModel, user.uuid)

  const response = await client
    .get(`${API_ENDPOINT}/${alert.uuid}`)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: alert })

  await cleanUp(alert)
  await cleanUpUser(user)
})

// 6. get/id (ref)
test('should return structured response with references via get method.', async ({ client }) => {
  const user = await makeTesterUserUtil(UserModel)

  const alert = await makeTesterAlertUtil(AlertModel, user.uuid)

  const response = await client
    .get(`${API_ENDPOINT}/${alert.uuid}`)
    .loginVia(user, 'jwt')
    .query({ references: 'user' })
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: { ...alert, user: { uuid: user.uuid } } })

  await cleanUp(alert)
  await cleanUpUser(user)
})

// 7. post (error)
test('should return error message and status code 400 when field data is missing.', async ({ client }) => {
  const user = await makeTesterUserUtil(UserModel)

  const response = await client
    .post(API_ENDPOINT)
    .loginVia(user, 'jwt')
    .send(ALERT_ATTRIBUTE)
    .end()

  response.assertStatus(400)

  await cleanUpUser(user)
})

// 8. post (no-ref)
test('should return structured data with no references via post method.', async ({ client }) => {
  const user = await makeTesterUserUtil(UserModel)

  await makeTesterCustomerUtil(CustomerModel, user.uuid, true)

  const response = await client
    .post(API_ENDPOINT)
    .loginVia(user, 'jwt')
    .send({ ...ALERT_ATTRIBUTE, user_uuid: user.uuid })
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: { user_uuid: user.uuid } })

  await cleanUp(response.body.data)
  await cleanUpUser(user)
})

// 9. post (ref)
test('should return structured data with references via post method.', async ({ client }) => {
  const user = await makeTesterUserUtil(UserModel)

  await makeTesterCustomerUtil(CustomerModel, user.uuid, true)

  const response = await client
    .post(API_ENDPOINT)
    .loginVia(user, 'jwt')
    .send({ ...ALERT_ATTRIBUTE, user_uuid: user.uuid })
    .query({ references: 'user' })
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: { user_uuid: user.uuid, user: { uuid: user.uuid } } })

  await cleanUp(response.body.data)
  await cleanUpUser(user)
})

// 10. put (no-ref)
test('should return structured data with no references via put method.', async ({ client }) => {
  const user = await makeTesterUserUtil(UserModel)

  await makeTesterCustomerUtil(CustomerModel, user.uuid, true)

  const alert = await makeTesterAlertUtil(AlertModel, user.uuid)

  const response = await client
    .put(`${API_ENDPOINT}/${alert.uuid}`)
    .loginVia(user, 'jwt')
    .send({ content: 'new_content' })
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: { content: 'new_content' } })

  await cleanUp(alert)
  await cleanUpUser(user)
})

// 11. put (ref)
test('should return structured data with references via put method.', async ({ client }) => {
  const user = await makeTesterUserUtil(UserModel)

  await makeTesterCustomerUtil(CustomerModel, user.uuid, true)

  const alert = await makeTesterAlertUtil(AlertModel, user.uuid)

  const response = await client
    .put(`${API_ENDPOINT}/${alert.uuid}`)
    .loginVia(user, 'jwt')
    .send({ content: 'new_content' })
    .query({ references: 'user' })
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: { content: 'new_content', user: { uuid: user.uuid } } })

  await cleanUp(alert)
  await cleanUpUser(user)
})

// 12. delete
test('should not return error message when delete object via delete method.', async ({ client }) => {
  const user = await makeTesterUserUtil(UserModel)

  const admin = await makeTesterAdminUtil(UserModel)

  const alert = await makeTesterAlertUtil(AlertModel, user.uuid)

  const response = await client
    .delete(`${API_ENDPOINT}/${alert.uuid}`)
    .loginVia(admin, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({ error: undefined })

  await cleanUpUser(user)
  await cleanUpUser(admin)
})
