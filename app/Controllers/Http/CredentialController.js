'use strict'

const Drive = use('Drive')
const Encryption = use('Encryption')
const performAuthentication = require('../../../util/authenticate.func')
const processMultiPartFile = require('../../../service/multiPartFileProcessor')
const makeCustomerUtil = require('../../../util/CustomerUtil.func')
const Customer = use('App/Models/Customer')
const Token = use('App/Models/Token')
const CronJob = require('cron').CronJob
const CronModel = use('App/Models/CronJob')
const makeCronUtil = require('../../../util/cronjobs/cronjob-util.func')

class CredentialController {
  async login({ auth, request }) {
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

  async reAuthenticate({ auth, request }) {
    const refreshToken = request.header('refreshToken')

    const { tokens, error } = await performAuthentication(auth).getNewToken(
      refreshToken
    )

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

  async logout({ auth, request }) {
    const refreshToken = request.header('refreshToken')

    const { data, error } = await performAuthentication(auth).logout(
      Token,
      Encryption,
      refreshToken
    )

    const { uuid } = await makeCronUtil(CronModel).updateByToken(refreshToken, {
      job_active: false
    })

    global.CronJobManager.deleteJob(uuid)

    // FIXME: Remove before production
    // await auth.authenticator("jwt").revokeTokens([refreshToken]);
    // console.log(
    //   await Token.query()
    //     .where({ token: Encryption.decrypt(refreshToken) })
    //     .fetch()
    //     .then((response) => response.first().toJSON().token_id)
    // );

    return {
      status: 200,
      error,
      data
    }
  }

  async validate({ auth, request }) {
    try {
      await performAuthentication(auth).authenticate()

      const credentialPicture = request.file('credential-picture', {
        types: ['image'],
        size: '2mb'
      })

      const { references } = request.qs

      const { username, uuid } = await auth
        .getUser()
        .then((response) => response.toJSON())

      const processedFileReturnValue = await processMultiPartFile(
        credentialPicture,
        username
      )

      if (processedFileReturnValue.error) {
        return {
          status: 500,
          error: processedFileReturnValue.error,
          data: undefined
        }
      }

      const customer = await makeCustomerUtil(Customer).updateById(
        uuid,
        {
          path_to_credential: `tmpPath/uploads/${processedFileReturnValue.data}.jpg`
        },
        references
      )

      return {
        status: 200,
        error: undefined,
        data: `awaiting validation. ${customer}`
      }
    } catch (error) {
      return {
        status: 511,
        error: `${error}`,
        data: undefined
      }
    }
  }

  // for testing purpose
  // FIXME: Remove before production
  async job() {
    const a = 1
    const job = new CronJob(
      new Date(new Date().setMinutes(new Date().getMinutes() + 1)),
      function () {
        console.log(a)
        console.log('Job fired.')
        this.stop()
      },
      null,
      true,
      'Asia/Bangkok'
    )
    job.start()
  }

  async upload({ request }) {
    request.multipart.file('credential_image', {}, async (file) => {
      await Drive.disk('s3').put(file.clientName, file.stream)
    })

    await request.multipart.process()

    return {
      status: 200,
      error: undefined,
      data: 'Upload sucessful.'
    }
  }

  async download() {
    const url = await Drive.disk('s3').getSignedUrl('GMK+9009+Apple.jpeg')

    return {
      status: 200,
      error: undefined,
      data: url
    }
  }
  // for testing purpose
}

module.exports = CredentialController
