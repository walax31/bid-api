'use strict'

const makeTesterAlertUtil = require('../../util/testerUtil/autogenAlertInstance.func')
const makeTesterUserUtil = require('../../util/testerUtil/autogenUserInstance.func')
const makeTesterAdminUtil = require('../../util/testerUtil/autogenAdminInstance.func')
const makeAlertUtil = require('../../util/alertUtil.func')
const makeTesterCustomerUtil = require('../../util/testerUtil/autogenCustomerInstance.func')
const makeCronUtil = require('../../util/cronjobs/cronjob-util.func')
const expireAlertUtil = require('../../util/cronjobs/expire-alert-util.func')

const { test, trait } = use('Test/Suite')('Alert Controller')
const AlertModel = use('App/Models/Alert')
const UserModel = use('App/Models/User')
const CustomerModel = use('App/Models/Customer')
const CronModel = use('App/Models/CronJob')
const CronJobManager = require('cron-job-manager')

trait('Test/ApiClient')
trait('Auth/Client')

const API_ENDPOINT = '/api/v1/alerts'

/* Route config
 * index (customer,admin)
 * show (customer,admin)
 * store (customer,admin) (strict)
 * update (customer,admin)
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
 * 12. put (bulk no-ref)
 * 13. delete
 * */

const ALERT_ATTRIBUTE = {
  title: 'title',
  type: 'bid',
  content: 'Your bid has been overbid by someone.',
  reference: 'product-uuid'
}

function generatePrerequisite (cronjob, alert) {
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

  const cronjob = await makeCronUtil(CronModel).create({
    job_title: 'alert',
    content: alert.uuid
  })

  generatePrerequisite(cronjob, alert)

  const response = await client
    .put(`${API_ENDPOINT}/${alert.uuid}`)
    .loginVia(user, 'jwt')
    .send({ is_proceeded: 1 })
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: { is_proceeded: 1 } })

  await cleanUp(alert)
  await cleanUpUser(user)
})

// 11. put (ref)
test('should return structured data with references via put method.', async ({ client }) => {
  const user = await makeTesterUserUtil(UserModel)

  await makeTesterCustomerUtil(CustomerModel, user.uuid, true)

  const alert = await makeTesterAlertUtil(AlertModel, user.uuid)

  const cronjob = await makeCronUtil(CronModel).create({
    job_title: 'alert',
    content: alert.uuid
  })

  generatePrerequisite(cronjob, alert)

  const response = await client
    .put(`${API_ENDPOINT}/${alert.uuid}`)
    .loginVia(user, 'jwt')
    .send({ is_proceeded: 1 })
    .query({ references: 'user' })
    .end()

  response.assertStatus(200)
  response.assertJSONSubset({ data: { is_proceeded: 1, user: { uuid: user.uuid } } })

  await cleanUp(alert)
  await cleanUpUser(user)
})

// 12. put (bulk no-ref)
test('should return bulk structured data with no references via put method.', async ({ client }) => {
  const user = await makeTesterUserUtil(UserModel)

  await makeTesterCustomerUtil(CustomerModel, user.uuid, true)

  const alertPromises = new Array(5)
    .fill(0)
    // eslint-disable-next-line
    .map((_) => makeTesterAlertUtil(AlertModel, user.uuid))

  const alerts = await Promise.all(alertPromises)

  const alertUuids = alerts.map(alert => alert.uuid)

  const cronjobPromises = alerts.map(alert =>
    makeCronUtil(CronModel).create({
      job_title: 'alert',
      content: alert.uuid
    }))

  const cronjobs = await Promise.all(cronjobPromises)

  cronjobs.forEach((_, index) =>
    generatePrerequisite(cronjobs[index], alerts[index]))

  const response = await client
    .put(API_ENDPOINT)
    .loginVia(user, 'jwt')
    .query({ list: alertUuids.join(',') })
    .end()

  const fakeAlerts = alerts.map(alert => ({ ...alert, is_read: 1 }))

  response.assertStatus(200)
  response.assertJSONSubset({ data: fakeAlerts })

  const cleanUpPromises = alerts.map(alert => cleanUp(alert))

  await Promise.all(cleanUpPromises)
  await cleanUpUser(user)
})

// 13. delete
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
