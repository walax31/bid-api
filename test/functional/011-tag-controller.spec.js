'use strict'

const makeTestTagUtil = require('../../util/testerUtil/autogenTagInstance.func')
const makeTesterUserUtil = require('../../util/testerUtil/autogenUserInstance.func')
const makeTesterAdminUtil = require('../../util/testerUtil/autogenAdminInstance.func')
const makeTesterCustomerUtil = require('../../util/testerUtil/autogenCustomerInstance.func')

const { test, trait } = use('Test/Suite')('Tag Controller')
const TagModel = use('App/Models/Tag')
const UserModel = use('App/Models/User')
const CustomerModel = use('App/Models/Customer')

trait('Test/ApiClient')
trait('Auth/Client')

const API_ENDPOINT = '/api/v1/tags'

/* Route config
 * index (all)
 * show (all)
 * store (customer) (strict)
 * update (admin)
 * destroy (admin)
 * */

/* Test cases
 * 1. get (empty)
 * 2. get/id (empty)
 * 3. get (no-ref)
 * 4. get/id (no-ref)
 * 5. post (error)
 * 6. post (no-ref)
 * 7. put (no-ref)
 * 8. delete
 * */

const TAG_ATTRIBUTE = { tag_name: 'tag_name' }

async function generatePrerequisite () {
  const user = await makeTesterUserUtil(UserModel)

  return [user, await makeTesterCustomerUtil(CustomerModel, user.uuid, true)]
}

async function generateAdminPrerequisite () {
  return makeTesterAdminUtil(UserModel)
}

async function cleanUp (tag) {
  await TagModel.find(tag.uuid).then(query => query.delete())
}

async function cleanUpUser (user) {
  await UserModel.find(user.uuid).then(query => query.delete())
}

// 1. get (empty)
test('should return structured response with empty array via get method.', async ({ client }) => {
  const response = await client.get(API_ENDPOINT).end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: [] })
})

// 2. get/id (empty)
test('should return structured response with empty data via get method.', async ({ client }) => {
  const response = await client.get(`${API_ENDPOINT}/1`).end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: {} })
})

// 3. get (no-ref)
test('should return structured response with no references in an array via get method.', async ({ client }) => {
  const tag = await makeTestTagUtil(TagModel)

  const response = await client.get(API_ENDPOINT).end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: [tag] })

  await cleanUp(tag)
})

// 4. get/id (no-ref)
test('should return structured response with no references via get method.', async ({ client }) => {
  const tag = await makeTestTagUtil(TagModel)

  const response = await client.get(`${API_ENDPOINT}/${tag.uuid}`).end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: tag })

  await cleanUp(tag)
})

// 5. post (error)
test('should return error message and status code 400 when field data is missing.', async ({ client }) => {
  const [user] = await generatePrerequisite()

  const response = await client
    .post(API_ENDPOINT)
    .loginVia(user, 'jwt')
    .send({})
    .end()

  response.assertStatus(400)
  response.assertJSONSubset({ data: undefined })

  await cleanUpUser(user)
})

// 6. post (no-ref)
test('should return structured data with no references via post method.', async ({ client }) => {
  const [user] = await generatePrerequisite()

  const response = await client
    .post(API_ENDPOINT)
    .loginVia(user, 'jwt')
    .send(TAG_ATTRIBUTE)
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: { uuid: response.body.data.uuid } })

  await cleanUp(response.body.data)
  await cleanUpUser(user)
})

// 7. put (no-ref)
test('should return structured data with no references via put method.', async ({ client }) => {
  const admin = await generateAdminPrerequisite()

  const tag = await makeTestTagUtil(TagModel)

  const response = await client
    .put(`${API_ENDPOINT}/${tag.uuid}`)
    .loginVia(admin, 'jwt')
    .send({ tag_name: 'new_tag_name' })
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: { tag_name: 'new_tag_name' } })

  await cleanUp(tag)
  await cleanUpUser(admin)
})

// 8. delete
test('should not return error message when delete object via delete method.', async ({ client }) => {
  const admin = await generateAdminPrerequisite()

  const tag = await makeTestTagUtil(TagModel)

  const response = await client
    .delete(`${API_ENDPOINT}/${tag.uuid}`)
    .loginVia(admin, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({ error: undefined })

  await cleanUpUser(admin)
})
