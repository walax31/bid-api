'use strict'

const makeAlertUtil = require('../../util/alertUtil.func')
const makeTesterAlertUtil = require('../../util/testerUtil/autogenAlertInstance.func')
const makeTesterUserUtil = require('../../util/testerUtil/autogenUserInstance.func')

const { test } = use('Test/Suite')('Alert Util')
const AlertModel = use('App/Models/Alert')
const UserModel = use('App/Models/User')

/* Test cases
 * 1. getAll. (empty)
 * 2. getById.
 * 3. getAll.
 * 4. create.
 * 5. updateById.
 * 6. deleteById.
 * */

const ALERT_ATTRIBUTE = {
  title: 'title',
  type: 'bid',
  content: 'Your bid has been overbid by someone.',
  reference: 'product uuid'
}

async function cleanUp (alert) {
  await AlertModel.find(alert.uuid).then(query => query.delete())
}

async function cleanUpUser (user) {
  await UserModel.find(user.uuid).then(query => query.delete())
}

// 1. getAll. (empty)
test('should return empty array of rows from makeAlertUtil.', async ({ assert }) => {
  const user = await makeTesterUserUtil(UserModel)

  const alerts = await makeAlertUtil(AlertModel).getAll(user.uuid)

  assert.equal(alerts.rows.length, 0)

  await cleanUpUser(user)
})

// 2. getById.
test('should return index of created object from makeAlertUtil.', async ({ assert }) => {
  const user = await makeTesterUserUtil(UserModel)

  const alert = await makeTesterAlertUtil(AlertModel, user.uuid)

  const { uuid } = await makeAlertUtil(AlertModel).getById(
    alert.uuid,
    user.uuid
  )

  assert.isOk(uuid)

  await cleanUp(alert)
  await cleanUpUser(user)
})

// 3. getAll.
test('should return array of rows from makeAlertUtil.', async ({ assert }) => {
  const user = await makeTesterUserUtil(UserModel)

  const alert = await makeTesterAlertUtil(AlertModel, user.uuid)

  const alerts = await makeAlertUtil(AlertModel).getAll(user.uuid)

  assert.isAbove(alerts.rows.length, 0)

  await cleanUp(alert)
  await cleanUpUser(user)
})

// 4. create.
test('should return index of created object from makeAlertUtil.', async ({ assert }) => {
  const user = await makeTesterUserUtil(UserModel)

  const alert = await makeAlertUtil(AlertModel).create({
    ...ALERT_ATTRIBUTE,
    user_uuid: user.uuid
  })

  assert.isOk(alert.uuid)

  await cleanUp(alert)
  await cleanUpUser(user)
})

// 5. updateById.
test('should return index of modified object from makeAlertUtil.', async ({ assert }) => {
  const user = await makeTesterUserUtil(UserModel)

  const alert = await makeTesterAlertUtil(AlertModel, user.uuid)

  const { content } = await makeAlertUtil(AlertModel).updateById(alert.uuid, { content: 'new_content' })

  assert.equal(content, 'new_content')

  await cleanUp(alert)
  await cleanUpUser(user)
})

// 6. deleteById.
test('should return index of deleted object from makeAlertUtil.', async ({ assert }) => {
  const user = await makeTesterUserUtil(UserModel)

  const { uuid } = await makeTesterAlertUtil(AlertModel, user.uuid)

  const alert = await makeAlertUtil(AlertModel).deleteById(uuid)

  assert.isOk(alert)

  await cleanUpUser(user)
})
