'use strict'

const makeTesterUserUtil = require('../../util/testerUtil/autogenUserInstance.func')
const makeTesterCustomerUtil = require('../../util/testerUtil/autogenCustomerInstance.func')
const makeTesterAddressUtil = require('../../util/testerUtil/autogenAddressInstance.func')

const { test, trait } = use('Test/Suite')('Address Controller')
const UserModel = use('App/Models/User')
const CustomerModel = use('App/Models/Customer')
const AddressModel = use('App/Models/Address')

trait('Test/ApiClient')
trait('Auth/Client')

const API_ENDPOINT = '/api/v1/addresses'

/* Route config
 * index (customer,admin)
 * show (customer,admin)
 * store (customer)
 * update (customer) (strict)
 * destroy (customer) (strict)
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

const ADDRESS_ATTRIBUTE = {
  phone: '(000) 000-0000',
  building: 'somebuildingdownthestreet',
  road: 'example rd.',
  city: 'some example city',
  sub_city: 'some example sub city',
  province: 'some example province',
  postal_code: '00000'
}

async function generatePrerequisite () {
  const user = await makeTesterUserUtil(UserModel)

  return [user, await makeTesterCustomerUtil(CustomerModel, user.uuid, true)]
}

async function cleanUpUser (user) {
  await UserModel.find(user.uuid).then(query => query.delete())
}

// 1. get (empty)
test('should return structured response with empty array via get method.', async ({ client }) => {
  const [user] = await generatePrerequisite()

  const response = await client.get(API_ENDPOINT).loginVia(user, 'jwt').end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: [] })

  await cleanUpUser(user)
})

// 2. get/id (empty)
test('should return structured response with empty data via get method.', async ({ client }) => {
  const [user] = await generatePrerequisite()

  const response = await client
    .get(`${API_ENDPOINT}/1`)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: {} })

  await cleanUpUser(user)
})

// 3. get (no-ref)
test('should return structured response with no references in an array via get method.', async ({ client }) => {
  const [user, customer] = await generatePrerequisite()

  const address = await makeTesterAddressUtil(AddressModel, customer.uuid)

  const response = await client.get(API_ENDPOINT).loginVia(user, 'jwt').end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: [address] })

  await cleanUpUser(user)
})

// 4. get (ref)
test('should return structured response with references in an array via get method.', async ({ client }) => {
  const [user, customer] = await generatePrerequisite()

  const address = await makeTesterAddressUtil(AddressModel, customer.uuid)

  const response = await client
    .get(API_ENDPOINT)
    .loginVia(user, 'jwt')
    .query({ references: 'customer' })
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: [{ ...address, customer: { uuid: customer.uuid } }] })

  await cleanUpUser(user)
})

// 5. get/id (no-ref)
test('should return structured response with no references via get method.', async ({ client }) => {
  const [user, customer] = await generatePrerequisite()

  const address = await makeTesterAddressUtil(AddressModel, customer.uuid)

  const response = await client
    .get(`${API_ENDPOINT}/${address.uuid}`)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: address })

  await cleanUpUser(user)
})

// 6. get/id (ref)
test('should return structured response with references via get method.', async ({ client }) => {
  const [user, customer] = await generatePrerequisite()

  const address = await makeTesterAddressUtil(AddressModel, customer.uuid)

  const response = await client
    .get(`${API_ENDPOINT}/${address.uuid}`)
    .loginVia(user, 'jwt')
    .query({ references: 'customer' })
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: { ...address, customer: { uuid: customer.uuid } } })

  await cleanUpUser(user)
})

// 7. post (error)
test('should return error message and status code 400 when field data is missing.', async ({ client }) => {
  const [user] = await generatePrerequisite()

  const response = await client
    .post(API_ENDPOINT)
    .loginVia(user, 'jwt')
    .send(ADDRESS_ATTRIBUTE)
    .end()

  response.assertStatus(400)
  response.assertJSONSubset({ data: undefined })

  await cleanUpUser(user)
})

// 8. post (no-ref)
test('should return structured data with no references via post method.', async ({ client }) => {
  const [user, customer] = await generatePrerequisite()

  const response = await client
    .post(API_ENDPOINT)
    .loginVia(user, 'jwt')
    .send({ ...ADDRESS_ATTRIBUTE, customer_uuid: customer.uuid })
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: { ...ADDRESS_ATTRIBUTE, customer_uuid: customer.uuid } })

  await cleanUpUser(user)
})

// 9. post (ref)
test('should return structured data with references via post method.', async ({ client }) => {
  const [user, customer] = await generatePrerequisite()

  const response = await client
    .post(API_ENDPOINT)
    .loginVia(user, 'jwt')
    .send({ ...ADDRESS_ATTRIBUTE, customer_uuid: customer.uuid })
    .query({ references: 'customer' })
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({
    data: {
      ...ADDRESS_ATTRIBUTE,
      customer_uuid: customer.uuid,
      customer: { uuid: customer.uuid }
    }
  })

  await cleanUpUser(user)
})

// 10. put (no-ref)
test('should return structured data with no references via put method.', async ({ client }) => {
  const [user, customer] = await generatePrerequisite()

  const address = await makeTesterAddressUtil(AddressModel, customer.uuid)

  const response = await client
    .put(`${API_ENDPOINT}/${address.uuid}`)
    .loginVia(user, 'jwt')
    .send({ phone: '(000) 000-0001' })
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: { phone: '(000) 000-0001' } })

  await cleanUpUser(user)
})

// 11. put (ref)
test('should return structured data with references via put method.', async ({ client }) => {
  const [user, customer] = await generatePrerequisite()

  const address = await makeTesterAddressUtil(AddressModel, customer.uuid)

  const response = await client
    .put(`${API_ENDPOINT}/${address.uuid}`)
    .loginVia(user, 'jwt')
    .send({ phone: '(000) 000-0001' })
    .query({ references: 'customer' })
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: { phone: '(000) 000-0001', customer: { uuid: customer.uuid } } })

  await cleanUpUser(user)
})

// 12. delete
test('should not return error message when delete object via delete method.', async ({ client }) => {
  const [user, customer] = await generatePrerequisite()

  const address = await makeTesterAddressUtil(AddressModel, customer.uuid)

  const response = await client
    .delete(`${API_ENDPOINT}/${address.uuid}`)
    .loginVia(user, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({ error: undefined })

  await cleanUpUser(user)
})
