'use strict'

const makeAddressUtil = require('../../util/addressUtil.func')
const makeTesterUserUtil = require('../../util/testerUtil/autogenUserInstance.func')
const makeTesterCustomerUtil = require('../../util/testerUtil/autogenCustomerInstance.func')
const makeTesterAddressUtil = require('../../util/testerUtil/autogenAddressInstance.func')

const { test } = use('Test/Suite')('Address Util')
const AddressModel = use('App/Models/Address')
const UserModel = use('App/Models/User')
const CustomerModel = use('App/Models/Customer')

/* Test cases
 * 1. getAll. (empty)
 * 2. getById.
 * 3. getAll.
 * 4. create.
 * 5. updateById.
 * 6. deleteById.
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

  return [user, await makeTesterCustomerUtil(CustomerModel, user.uuid)]
}

async function cleanUp (user) {
  await UserModel.find(user.uuid).then(query => query.delete())
}

// 1. getAll. (empty)
test('should return empty array of rows from makeAddressUtil.', async ({ assert }) => {
  const customers = await makeAddressUtil(AddressModel).getAll('')

  assert.equal(customers.rows.length, 0)
})

// 2. getById.
test('should return index of created object from makeAddressUtil.', async ({ assert }) => {
  const [user, customer] = await generatePrerequisite()

  const { uuid } = await makeAddressUtil(AddressModel)
    .create({
      ...ADDRESS_ATTRIBUTE,
      customer_uuid: customer.uuid
    })
    .then(response => response.toJSON())

  const address = await makeAddressUtil(AddressModel)
    .getById(uuid)
    .then(response => response.toJSON())

  assert.isOk(address)

  await cleanUp(user)
})

// 3. getAll.
test('should return array of rows from makeAddressUtil.', async ({ assert }) => {
  const [user, customer] = await generatePrerequisite()

  await makeTesterAddressUtil(AddressModel, customer.uuid)

  const address = await makeAddressUtil(AddressModel).getAll('')

  assert.isAbove(address.rows.length, 0)

  await cleanUp(user)
})

// 4. create.
test('should return index of created object from makeAddressUtil.', async ({ assert }) => {
  const [user, customer] = await generatePrerequisite()

  const { uuid } = await makeAddressUtil(AddressModel).create({
    ...ADDRESS_ATTRIBUTE,
    customer_uuid: customer.uuid
  })

  const address = await makeAddressUtil(AddressModel).getById(uuid)

  assert.isOk(address)

  await cleanUp(user)
})

// 5. updateById.
test('should return index of modified object from makeAddressUtil.', async ({ assert }) => {
  const [user, customer] = await generatePrerequisite()

  const { uuid } = await makeTesterAddressUtil(AddressModel, customer.uuid)

  const address = await makeAddressUtil(AddressModel).updateById(uuid, { phone: '(000) 000-0001' })

  assert.equal(address.phone, '(000) 000-0001')

  await cleanUp(user)
})

// 6. deleteById.
test('should return index of deleted object from makeAddressUtil.', async ({ assert }) => {
  const [user, customer] = await generatePrerequisite()

  const { uuid } = await makeTesterAddressUtil(AddressModel, customer.uuid)

  const address = await makeAddressUtil(AddressModel).deleteById(uuid)

  assert.isOk(address)

  await cleanUp(user)
})
