'use strict'

const Alert = use('App/Models/Alert')
const CronModel = use('App/Models/CronJob')

const makeAlertUtil = require('../../../util/alertUtil.func')
const makeCronUtil = require('../../../util/cronjobs/cronjob-util.func')

class AlertController {
  async index ({ request }) {
    const { references = '', page, per_page } = request.qs

    const { rows, pages } = await makeAlertUtil(Alert).getAllValid(
      request.user_uuid,
      references,
      page,
      per_page
    )

    return {
      status: 200,
      error: undefined,
      pages,
      data: rows
    }
  }

  async show ({ request }) {
    const { params, qs, user_uuid } = request

    const { id } = params

    const { references } = qs

    const alert = await makeAlertUtil(Alert).getById(id, user_uuid, references)

    return {
      status: 200,
      error: undefined,
      data: alert || {}
    }
  }

  async store ({ request }) {
    const { qs, body } = request

    const { references } = qs

    const alert = await makeAlertUtil(Alert).create(body, references)

    return {
      status: 200,
      error: undefined,
      data: alert
    }
  }

  async update ({ request }) {
    const { params, qs, body } = request

    const { id } = params

    const { references } = qs

    const { is_proceeded, is_cancelled, expiration_date } = body

    if (is_proceeded || is_cancelled || expiration_date) {
      const alert = await makeAlertUtil(Alert).alertBelongToUser(
        id,
        request.user_uuid
      )

      if (!alert) {
        return {
          status: 403,
          error: 'Access denied. this alert does not belong to you.',
          data: undefined
        }
      }

      const cronjob = await makeCronUtil(CronModel).getByToken(id)
      if (is_proceeded || is_cancelled) {
        global.CronJobManager.deleteJob(cronjob.uuid)
      } else if (expiration_date) {
        global.CronJobManager.update(cronjob.uuid, expiration_date)
      }
    }

    const alert = await makeAlertUtil(Alert).updateById(
      id,
      { is_proceeded, is_cancelled, expiration_date },
      references
    )

    return {
      status: 200,
      error: undefined,
      data: alert
    }
  }

  async destroy ({ request }) {
    const { id } = request.params

    await makeAlertUtil(Alert).deleteById(id)

    return {
      status: 200,
      error: undefined,
      data: { message: `Alert ${id} is successfully removed.` }
    }
  }
}

module.exports = AlertController
