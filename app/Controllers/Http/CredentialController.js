'use strict'

const performAuthentication = require('../../../util/authenticate.func')
const makeCronUtil = require('../../../util/cronjobs/cronjob-util.func')

const Encryption = use('Encryption')
const Token = use('App/Models/Token')
const CronModel = use('App/Models/CronJob')

class CredentialController {
  async login ({ auth, request }) {
    const { username, password } = request.all()

    const { tokens, error } = await performAuthentication(auth).login({
      username,
      password
    })

    if (tokens) {
      const { uuid } = await makeCronUtil(CronModel).create(
        { job_title: 'token', content: tokens.refreshToken },
        ''
      )

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

  async logout ({ auth, request }) {
    const refreshToken = request.header('refreshToken')

    const { data, error } = await performAuthentication(auth).logout(
      Token,
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
