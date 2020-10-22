'use strict'

const makeTesterUserUtil = require('../../util/testerUtil/autogenUserInstance.func')
const makeTesterCustomerUtil = require('../../util/testerUtil/autogenCustomerInstance.func')
const makeTesterAdminUtil = require('../../util/testerUtil/autogenAdminInstance.func')
const makeTesterAddressUtil = require('../../util/testerUtil/autogenAddressInstance.func')
const makeCronUtil = require('../../util/cronjobs/cronjob-util.func')
const makeAlertUtil = require('../../util/alertUtil.func')
const expireAlertUtil = require('../../util/cronjobs/expire-alert-util.func')
const CronJobManager = require('cron-job-manager')

const { test, trait } = use('Test/Suite')('Customer Controller')
const UserModel = use('App/Models/User')
const CustomerModel = use('App/Models/Customer')
const AddressModel = use('App/Models/Address')
const AlertModel = use('App/Models/Alert')
const CronModel = use('App/Models/CronJob')

trait('Test/ApiClient')
trait('Auth/Client')

const urlEndPoint = '/api/v1/customers'

async function generatePrerequisite (admin, user) {
  const alert = await makeAlertUtil(AlertModel)
    .create({
      title: '',
      user_uuid: admin.uuid,
      type: 'verification',
      content: '...',
      reference: user.uuid,
      accept: 'approve',
      decline: 'reject'
    })
    .then(query => query.toJSON())

  const cronjob = await makeCronUtil(CronModel).create({
    job_title: 'alert',
    content: alert.uuid
  })

  if (global.CronJobManager) {
    global.CronJobManager.add(
      cronjob.uuid,
      new Date(new Date().setMinutes(new Date().getMinutes() + 1)),
      () =>
        expireAlertUtil(
          CronModel,
          makeCronUtil,
          cronjob.uuid,
          AlertModel,
          makeAlertUtil,
          alert.uuid
        ),
      {
        start: true,
        timeZone: 'Asia/Bangkok'
      }
    )
  } else {
    global.CronJobManager = new CronJobManager(
      cronjob.uuid,
      new Date(new Date().setMinutes(new Date().getMinutes() + 1)),
      () =>
        expireAlertUtil(
          CronModel,
          makeCronUtil,
          cronjob.uuid,
          AlertModel,
          makeAlertUtil,
          alert.uuid
        ),
      {
        start: true,
        timeZone: 'Asia/Bangkok'
      }
    )
  }
}

test('should return structured response with empty data array via get method.', async ({ client }) => {
  const admin = await makeTesterAdminUtil(UserModel)

  const response = await client.get(urlEndPoint).loginVia(admin, 'jwt').end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: [] })

  await UserModel.find(admin.uuid).then(query => query.delete())
})

test('should return structured response with empty data via get method.', async ({ client }) => {
  const admin = await makeTesterAdminUtil(UserModel)

  const response = await client
    .get(`${urlEndPoint}/1`)
    .loginVia(admin, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: {} })

  await UserModel.find(admin.uuid).then(query => query.delete())
})

test('should return error message and status code of 400 when field data is missing.', async ({ client }) => {
  const user = await makeTesterUserUtil(UserModel)

  const customer = { first_name: 'dasdad' }

  const response = await client
    .post(urlEndPoint)
    .loginVia(user, 'jwt')
    .send(customer)
    .end()

  response.assertStatus(400)

  await UserModel.find(user.uuid).then(query => query.delete())
})

test('should return structured response with no references in an array via get method.', async ({ client }) => {
  const admin = await makeTesterAdminUtil(UserModel)

  const user = await makeTesterUserUtil(UserModel)

  const { uuid } = await makeTesterCustomerUtil(CustomerModel, user.uuid)

  await makeTesterAddressUtil(AddressModel, uuid)

  const response = await client.get(urlEndPoint).loginVia(admin, 'jwt').end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: [{ uuid }] })

  await UserModel.find(user.uuid).then(query => query.delete())
  await UserModel.find(admin.uuid).then(query => query.delete())
})

test('should return structured response with references in an array via get method.', async ({ client }) => {
  const admin = await makeTesterAdminUtil(UserModel)

  const user = await makeTesterUserUtil(UserModel)

  const { uuid } = await makeTesterCustomerUtil(CustomerModel, user.uuid)

  await makeTesterAddressUtil(AddressModel, uuid)

  const response = await client
    .get(urlEndPoint)
    .loginVia(admin, 'jwt')
    .query({ references: 'user,address' })
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: [{ uuid, user: { uuid: user.uuid } }] })

  await UserModel.find(user.uuid).then(query => query.delete())
  await UserModel.find(admin.uuid).then(query => query.delete())
})

test('should return structured data with no references via post method.', async ({ client }) => {
  const admin = await makeTesterAdminUtil(UserModel)
  const user = await makeTesterUserUtil(UserModel)

  const customerData = {
    first_name: 'sdaw',
    last_name: 'dawdad'
  }

  const response = await client
    .post(urlEndPoint)
    .loginVia(user, 'jwt')
    .send(customerData)
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: customerData })

  await UserModel.find(user.uuid).then(query => query.delete())
  await UserModel.find(admin.uuid).then(query => query.delete())
})

test('should return structured data with references via post method.', async ({ client }) => {
  const admin = await makeTesterAdminUtil(UserModel)
  const user = await makeTesterUserUtil(UserModel)

  const customerData = {
    first_name: 'sdaw',
    last_name: 'dawdad'
  }

  const response = await client
    .post(urlEndPoint)
    .loginVia(user, 'jwt')
    .send(customerData)
    .query({ references: 'user' })
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: { user: { uuid: user.uuid } } })

  await UserModel.find(user.uuid).then(query => query.delete())
  await UserModel.find(admin.uuid).then(query => query.delete())
})

test('should return structured data with no references via put method.', async ({ client }) => {
  const admin = await makeTesterAdminUtil(UserModel)
  const user = await makeTesterUserUtil(UserModel, true)

  const { uuid } = await makeTesterCustomerUtil(CustomerModel, user.uuid)

  await makeTesterAddressUtil(AddressModel, uuid)

  generatePrerequisite(admin, user)

  const response = await client
    .put(`${urlEndPoint}/${user.uuid}`)
    .loginVia(admin, 'jwt')
    .send({ is_validated: true })
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: { is_validated: 1 } })

  await UserModel.find(user.uuid).then(query => query.delete())
  await UserModel.find(admin.uuid).then(query => query.delete())
})

test('should return structured data with references via put method.', async ({ client }) => {
  const admin = await makeTesterAdminUtil(UserModel)
  const user = await makeTesterUserUtil(UserModel, true)

  const { uuid } = await makeTesterCustomerUtil(CustomerModel, user.uuid)

  const address = await makeTesterAddressUtil(AddressModel, uuid)

  await generatePrerequisite(admin, user)

  const response = await client
    .put(`${urlEndPoint}/${user.uuid}`)
    .loginVia(admin, 'jwt')
    .send({ is_validated: true })
    .query({ references: 'user,address' })
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: { is_validated: 1, user: { uuid: user.uuid }, address } })

  await UserModel.find(user.uuid).then(query => query.delete())
  await UserModel.find(admin.uuid).then(query => query.delete())
})

test('should return data index via delete method.', async ({ client }) => {
  const admin = await makeTesterAdminUtil(UserModel)

  const user = await makeTesterUserUtil(UserModel)

  const { uuid } = await makeTesterCustomerUtil(CustomerModel, user.uuid)

  const response = await client
    .delete(`${urlEndPoint}/${uuid}`)
    .loginVia(admin, 'jwt')
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({ status: 200 })

  await UserModel.find(user.uuid).then(query => query.delete())
  await UserModel.find(admin.uuid).then(query => query.delete())
})
