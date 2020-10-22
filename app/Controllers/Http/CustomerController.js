'use strict'

const CustomerModel = use('App/Models/Customer')
const UserModel = use('App/Models/User')
const AlertModel = use('App/Models/Alert')
const CronModel = use('App/Models/CronJob')
const Ws = use('Ws')

const makeCustomerUtil = require('../../../util/CustomerUtil.func')
const makeUserUtil = require('../../../util/UserUtil.func')
const makeAlertUtil = require('../../../util/alertUtil.func')
const makeCronUtil = require('../../../util/cronjobs/cronjob-util.func')
const broadcastAlert = require('../../../util/ws/broadcast-alert.util.func')

class CustomerController {
  async index ({ request, response }) {
    const { references, page, per_page } = request.qs

    const { rows, pages } = await makeCustomerUtil(CustomerModel).getAll(
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
    const { params, qs } = request

    const { id } = params

    const { references } = qs

    const customer = await makeCustomerUtil(CustomerModel).getById(
      id,
      references
    )

    return response.send({
      status: 200,
      error: undefined,
      data: customer || {}
    })
  }

  async store ({ request, response }) {
    const { body, qs } = request

    const { first_name, last_name } = body

    const { references } = qs

    const customer = await makeCustomerUtil(CustomerModel).create(
      {
        user_uuid: request.user_uuid,
        first_name,
        last_name
      },
      references
    )

    return response.send({
      status: 200,
      error: undefined,
      data: customer
    })
  }

  async update ({ request, response }) {
    const { body, params, qs } = request

    const { id } = params

    const { references } = qs

    const { first_name, last_name, is_validated, is_rejected } = body

    switch (request.role) {
      case 'admin': {
        try {
          const { uuid } = await makeUserUtil(UserModel)
            .hasSubmittionFlagged(id)
            .then(query => query.toJSON().customer || {})

          if (!uuid) {
            return response.status(404).send({
              status: 404,
              error:
                'Credential not found. this user never submitted credential.',
              data: undefined
            })
          }

          // eslint-disable-next-line
          const validatedCustomer = await makeCustomerUtil(
            CustomerModel).hasCredentialValidated(uuid)

          if (validatedCustomer) {
            return response.status(403).send({
              status: 403,
              error:
                'Access denied. this user already has their credential validated.',
              data: undefined
            })
          }

          if (!(is_validated || is_rejected) || (is_rejected && is_validated)) {
            return response.status(400).send({
              status: 400,
              error:
                'Validation require only one of the flag to be set to true.',
              data: undefined
            })
          }

          const customer = await makeCustomerUtil(CustomerModel).updateById(
            uuid,
            { is_validated, is_rejected },
            references
          )

          const alert = await makeAlertUtil(AlertModel)
            .create({
              expiration_date: new Date(new Date().setHours(new Date().getHours() + 72)),
              user_uuid: id,
              title: `Credential ${is_validated ? 'verified' : 'rejected'}`,
              type: 'credential',
              content: `Your credential has been ${
                is_validated ? 'validated' : 'rejected'
              }.`,
              reference: 'none',
              accept: is_validated ? 'Thanks' : 'Okay',
              decline: 'none'
            })
            .then(query => query.toJSON())

          const cron = await makeCronUtil(CronModel)
            .create({
              job_title: 'alert',
              content: alert.uuid
            })
            .then(query => query.toJSON())

          const previousAlert = await makeAlertUtil(AlertModel).getByReference(
            request.user_uuid,
            id
          )

          await makeAlertUtil(AlertModel).updateById(previousAlert.uuid, { is_proceeded: true })

          const cronjob = await makeCronUtil(CronModel).getByContent(previousAlert.uuid)

          global.CronJobManager.deleteJob(cronjob.uuid)

          broadcastAlert(Ws, request.user_uuid, 'remove:alert', previousAlert)

          return response.send({
            status: 200,
            error: undefined,
            data: customer,
            alert,
            cron
          })

          // eslint-disable-next-line
        } catch (e) {
          return response.status(500).send({
            status: 500,
            error: e.toString(),
            data: undefined
          })
        }
      }
      case 'customer': {
        if (request.customer_uuid === id) {
          if (first_name || last_name) {
            const customer = await makeCustomerUtil(CustomerModel).updateById(
              request.customer_uuid,
              {
                first_name,
                last_name
              },
              references
            )

            return response.send({
              status: 200,
              error: undefined,
              data: customer
            })
          }

          return response.status(422).send({
            status: 422,
            error: 'Missing params. update query is empty.',
            data: undefined
          })
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

    switch (request.role) {
      case 'customer': {
        if (request.customer_uuid !== id) {
          await makeCustomerUtil(CustomerModel).deleteById(id)

          return response.send({
            status: 200,
            error: undefined,
            data: `customer ${id} is successfully removed.`
          })
        }

        return response.status(403).send({
          status: 403,
          error: 'Access denied. id param does not match authenticated uuid.',
          data: undefined
        })
      }
      case 'admin': {
        await makeCustomerUtil(CustomerModel).deleteById(id)

        return response.send({
          status: 200,
          error: undefined,
          data: `customer ${id} is successfully removed.`
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
}

module.exports = CustomerController
