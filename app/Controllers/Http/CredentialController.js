'use strict'

const performAuthentication = require('../../../util/authenticate.func')
const makeCronUtil = require('../../../util/cronjobs/cronjob-util.func')

const Encryption = use('Encryption')
const TokenModel = use('App/Models/Token')
const CronModel = use('App/Models/CronJob')

class CredentialController {
  async login ({ auth, request }) {
    const { username, password } = request.all()

    const { tokens, error } = await performAuthentication(auth).login({
      username,
      password
    })

    if (tokens) {
      await makeCronUtil(CronModel).create(
        { job_title: 'token', content: tokens.refreshToken },
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
        tokens: { ...tokens, uuid }
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
      const { uuid } = await makeCronUtil(CronModel).getByToken(
        refreshToken,
        ''
      )

      await makeCronUtil(CronModel).updateById(
        uuid,
        { content: tokens.refreshToken },
        ''
      )

      const { uuid: user_uuid } = await TokenModel.query()
        .where({ token: await Encryption.decrypt(tokens.refreshToken) })
        .with('user')
        .fetch()
        .then(query => query.first().getRelated('user').toJSON())

      return {
        status: 200,
        error: undefined,
        data: undefined,
        tokens: { ...tokens, uuid: user_uuid }
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

    const { data, error } = await performAuthentication(auth).logout(
      TokenModel,
      Encryption,
      refreshToken
    )

    // eslint-disable-next-line
    const { uuid } = await makeCronUtil(CronModel).updateByToken(refreshToken, {
      job_active: false })

    global.CronJobManager.deleteJob(uuid)

    return {
      status: 200,
      error,
      data
    }
  }
}

module.exports = CredentialController
