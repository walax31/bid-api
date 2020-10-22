'use strict'

const AlertModel = use('App/Models/Alert')
const CronModel = use('App/Models/CronJob')

const makeAlertUtil = require('../../../util/alertUtil.func')
const makeCronUtil = require('../../../util/cronjobs/cronjob-util.func')

class AlertController {
  async index ({ request, response }) {
    const { references = '', page, per_page } = request.qs

    const { rows, pages } = await makeAlertUtil(AlertModel).getAllValid(
      request.user_uuid,
      references,
      page,
      per_page
    )

    return response.send({
      status: 200,
      error: undefined,
      pages,
      data: rows
    })
  }

  async show ({ request, response }) {
    const { params, qs, user_uuid } = request

    const { id } = params

    const { references } = qs

    const alert = await makeAlertUtil(AlertModel).getById(
      id,
      user_uuid,
      references
    )

    return response.send({
      status: 200,
      error: undefined,
      data: alert || {}
    })
  }

  async store ({ request, response }) {
    const { qs, body } = request

    const { references } = qs

    const alert = await makeAlertUtil(AlertModel).create(body, references)

    return response.send({
      status: 200,
      error: undefined,
      data: alert
    })
  }

  async update ({ request, response }) {
    const { params, qs, body } = request

    const { id } = params

    const { references } = qs

    const { is_proceeded, is_cancelled, expiration_date, is_read } = body

    if (is_proceeded || is_cancelled || expiration_date) {
      const alert = await makeAlertUtil(AlertModel).alertBelongToUser(
        id,
        request.user_uuid
      )

      if (!alert) {
        return response.status(403).send({
          status: 403,
          error: 'Access denied. this alert does not belong to you.',
          data: undefined
        })
      }

      const cronjob = await makeCronUtil(CronModel).getByContent(id)
      if (is_proceeded || is_cancelled) {
        global.CronJobManager.deleteJob(cronjob.uuid)
      } else if (expiration_date) {
        global.CronJobManager.update(cronjob.uuid, expiration_date)
      }
    }

    const alert = await makeAlertUtil(AlertModel).updateById(
      id,
      { is_proceeded, is_cancelled, expiration_date, is_read },
      references
    )

    return response.send({
      status: 200,
      error: undefined,
      data: alert,
      alert,
      broadcastType: 'remove'
    })
  }

  async bulkRead ({ request, response }) {
    const { list } = request.qs

    if (!list) {
      return response.status(404).send({
        status: 404,
        error: 'Alert not found. missing alert list in query string.',
        data: undefined
      })
    }

    const alerts = list.split(',')
    const unverifiedAlertsPromises = alerts.map(alert =>
      makeAlertUtil(AlertModel).alertBelongToUser(alert, request.user_uuid))

    const unverifiedAlerts = await Promise.all(unverifiedAlertsPromises)

    if (unverifiedAlerts.find(alert => alert === undefined)) {
      return response.status(403).send({
        status: 403,
        error: 'Access denied. alerts do not belong to user.',
        data: undefined
      })
    }

    const alertPromises = alerts.map(alert =>
      makeAlertUtil(AlertModel)
        .updateById(alert, { is_read: true })
        .then(query => query.toJSON()))

    const results = await Promise.all(alertPromises)

    return {
      status: 200,
      error: undefined,
      data: results,
      alerts: results,
      broadcastType: 'edit'
    }
  }

  async destroy ({ request, response }) {
    const { id } = request.params

    await makeAlertUtil(AlertModel).deleteById(id)

    return response.send({
      status: 200,
      error: undefined,
      data: { message: `Alert ${id} is successfully removed.` }
    })
  }
}

module.exports = AlertController
