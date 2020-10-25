'use strict'

const performAuthentication = require('../../../util/authenticate.func')
const makeCronUtil = require('../../../util/cronjobs/cronjob-util.func')
const makeCustomerUtil = require('../../../util/CustomerUtil.func')

const Encryption = use('Encryption')
const TokenModel = use('App/Models/Token')
const CronModel = use('App/Models/CronJob')
const CustomerModel = use('App/Models/Customer')

class CredentialController {
  async login ({ auth, request }) {
    const { username, password } = request.all()

    const { tokens, error } = await performAuthentication(auth).login({
      username,
      password
    })

    if (tokens) {
      const { uuid: cron_uuid } = await makeCronUtil(CronModel).create({
        job_title: 'token',
        content: tokens.refreshToken
      })
      // .then(query => query.toJSON())

      const { uuid } = await TokenModel.query()
        .where({ token: await Encryption.decrypt(tokens.refreshToken) })
        .with('user')
        .fetch()
        .then(query => query.first().getRelated('user').toJSON())

      return {
        status: 200,
        error: undefined,
        data: undefined,
        tokens: { ...tokens, uuid },
        // cron_uuid,
        cronjobProperties: [
          {
            cronjobType: 'token',
            uuid: cron_uuid,
            cronjobDate: new Date(new Date().setDate(new Date().getDate() + 7)),
            cronjobReferences: { refreshToken: tokens.refreshToken }
          }
        ]
      }
    }

    return {
      status: 200,
      error,
      data: undefined,
      tokens: undefined
    }
  }

  async reAuthenticate ({ auth, request }) {
    const refreshToken = request.header('refreshToken')

    const { tokens, error } = await performAuthentication(auth).getNewToken(refreshToken)

    if (tokens) {
      const { uuid: cron_uuid } = await makeCronUtil(CronModel)
        .getByContent(refreshToken, '')
        .then(query => query.toJSON())

      await makeCronUtil(CronModel).updateById(
        cron_uuid,
        { content: tokens.refreshToken },
        ''
      )

      const { uuid } = await TokenModel.query()
        .where({ token: await Encryption.decrypt(tokens.refreshToken) })
        .with('user')
        .fetch()
        .then(query => query.first().getRelated('user').toJSON())

      return {
        status: 200,
        error: undefined,
        data: undefined,
        tokens: { ...tokens, uuid },
        cronjobProperties: [
          {
            cronjobType: 'token',
            uuid: cron_uuid,
            cronjobDate: new Date(new Date().setDate(new Date().getDate() + 7)),
            cronjobReferences: { refreshToken: tokens.refreshToken }
          }
        ]
      }
    }

    return {
      status: 200,
      error,
      data: undefined,
      tokens: undefined
    }
  }

  async logout ({ auth, request }) {
    const refreshToken = request.header('refreshToken')

    const { token, error } = await performAuthentication(auth).logout(
      TokenModel,
      Encryption,
      refreshToken
    )

    // eslint-disable-next-line
    const { uuid } = await makeCronUtil(CronModel).updateByContent(
      refreshToken,
      { job_active: false }
    )

    global.CronJobManager.deleteJob(uuid)

    return {
      status: 200,
      error,
      data: token
    }
  }

  async authenticationCheck ({ request, response }) {
    if (request.user_uuid) {
      return response.status(200).send({
        status: 200,
        error: undefined,
        data: undefined
      })
    }

    return response.status(403).send({
      status: 403,
      error: 'Access denied. authentication failed.',
      data: undefined
    })
  }

  async validationCheck ({ request, response }) {
    if (!request.customer_uuid) {
      return response.status(403).send({
        status: 403,
        error: 'Access denied.',
        data: undefined
      })
    }
    // eslint-disable-next-line
    const validatedCustomer = await makeCustomerUtil(
      CustomerModel).hasCredentialValidated(request.customer_uuid)

    if (!validatedCustomer) {
      return response.status(403).send({
        status: 403,
        error: 'Access denied.',
        data: undefined
      })
    }

    return response.send({
      status: 200,
      error: undefined,
      data: undefined
    })
  }
}

module.exports = CredentialController
