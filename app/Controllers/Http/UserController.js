'use strict'

const Env = use('Env')
const UserModel = use('App/Models/User')
const CronModel = use('App/Models/CronJob')
const TokenModel = use('App/Models/Token')
const Encryption = use('Encryption')

const makeUserUtil = require('../../../util/UserUtil.func')
const makeCronUtil = require('../../../util/cronjobs/cronjob-util.func')
const performAuthentication = require('../../../util/authenticate.func')

class UserController {
  async index ({ request, response }) {
    const { references, page, per_page } = request.qs

    const { rows, pages } = await makeUserUtil(UserModel).getAll(
      references,
      page,
      per_page
    )

    return response.send({ status: 200, error: undefined, pages, data: rows })
  }

  async show ({ request, response }) {
    const { params, qs } = request

    const { id } = params

    const { references } = qs

    switch (request.role) {
      case 'customer': {
        if (request.user_uuid === id) {
          const data =
            (await makeUserUtil(UserModel).getById(
              request.user_uuid,
              references
            )) || {}

          return response.send({
            status: 200,
            error: undefined,
            data
          })
        }
        return response.status(403).send({
          status: 403,
          error: 'Access denied. id param does not match authenticated id.',
          data: undefined
        })
      }
      case 'admin': {
        const data =
          (await makeUserUtil(UserModel).getById(id, references)) || {}

        return response.send({
          status: 200,
          error: undefined,
          data
        })
      }
      default:
        return response.send({
          status: 200,
          error: undefined,
          data: undefined
        })
    }
  }

  async store ({ auth, request, response }) {
    const { body, qs } = request

    const { username, email, password, key } = body

    const { references } = qs

    const data = await makeUserUtil(UserModel).create(
      {
        username,
        email,
        password,
        is_admin: key === Env.get('APP_KEY')
      },
      references
    )

    const { tokens } = await performAuthentication(auth).login({
      username,
      password
    })

    if (tokens) {
      const { uuid: cron_uuid } = await makeCronUtil(CronModel)
        .create({ job_title: 'token', content: tokens.refreshToken }, '')
        .then(query => query.toJSON())

      await TokenModel.query()
        .where({ token: await Encryption.decrypt(tokens.refreshToken) })
        .with('user')
        .fetch()

      return response.send({
        status: 200,
        error: undefined,
        data,
        tokens: { ...tokens, uuid: data.toJSON().uuid },
        cronjobProperties: [
          {
            cronjobType: 'token',
            uuid: cron_uuid,
            cronjobDate: new Date(new Date().setDate(new Date().getDate() + 7)),
            cronjobReferences: { refreshToken: tokens.refreshToken }
          }
        ]
      })
    }

    return response.send({
      status: 200,
      error: undefined,
      data,
      tokens: undefined
    })
  }

  async update ({ request, response }) {
    const { body, params, qs } = request

    const { id } = params

    const { references } = qs

    const { email, description } = body

    switch (request.role) {
      case 'admin': {
        const user = await makeUserUtil(UserModel).updateById(
          id,
          { email },
          references
        )

        return response.send({ status: 200, error: undefined, data: user })
      }
      case 'customer': {
        if (request.user_uuid === id) {
          const user = await makeUserUtil(UserModel).updateById(
            request.user_uuid,
            { email, description },
            references
          )

          return response.send({ status: 200, error: undefined, data: user })
        }

        return response.status(403).send({
          status: 403,
          error: 'Access denied. id param does not match authenticated uuid.',
          data: undefined
        })
      }
      default:
        return response.send({
          status: 200,
          error: undefined,
          data: undefined
        })
    }
  }

  async destroy ({ request, response }) {
    const { id } = request.params

    const user = await makeUserUtil(UserModel).deleteById(id)

    return response.send({
      status: 200,
      error: undefined,
      data: { message: `${user} is successfully removed.` }
    })
  }
}

module.exports = UserController
