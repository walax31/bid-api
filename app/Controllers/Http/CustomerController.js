'use strict'

const CustomerModel = use('App/Models/Customer')
const UserModel = use('App/Models/User')
const AlertModel = use('App/Models/Alert')
const CronModel = use('App/Models/CronJob')

const makeCustomerUtil = require('../../../util/CustomerUtil.func')
const makeUserUtil = require('../../../util/UserUtil.func')
const makeAlertUtil = require('../../../util/alertUtil.func')
const makeCronUtil = require('../../../util/cronjobs/cronjob-util.func')

class CustomerController {
  async index ({ request }) {
    const { references, page, per_page } = request.qs

    const { rows, pages } = await makeCustomerUtil(CustomerModel).getAll(
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
    const { params, qs } = request

    const { id } = params

    const { references } = qs

    const customer = await makeCustomerUtil(CustomerModel).getById(
      id,
      references
    )

    return { status: 200, error: undefined, data: customer || {} }
  }

  async store ({ request }) {
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

    const flaggedUser = await makeUserUtil(UserModel).flagSubmition(request.user_uuid)

    if (!flaggedUser) {
      return {
        status: 500,
        error: 'Internal error. failed to flag user submittion.',
        data: undefined
      }
    }

    return {
      status: 200,
      error: undefined,
      data: customer
    }
  }

  async update ({ request }) {
    const { body, params, qs } = request

    const { id } = params

    const { references } = qs

    const { first_name, last_name } = body

    switch (request.role) {
      case 'admin': {
        try {
          const { uuid } = await makeUserUtil(UserModel)
            .hasSubmittionFlagged(id)
            .then(response => response.toJSON().customer || {})

          if (!uuid) {
            return {
              status: 404,
              error:
                'Credential not found. this user never submitted credential.',
              data: undefined
            }
          }

          // eslint-disable-next-line
          const validatedCustomer = await makeCustomerUtil(
            CustomerModel).hasCredentialValidated(uuid)

          if (validatedCustomer) {
            return {
              status: 403,
              error:
                'Access denied. this user already has their credential validated.',
              data: undefined
            }
          }

          // eslint-disable-next-line
          const customer = await makeCustomerUtil(
            CustomerModel).validateUserCredential(uuid, references)

          const alert = await makeAlertUtil(AlertModel).create({
            expiration_date: new Date(new Date().setHours(new Date().getHours() + 72)),
            user_uuid: id,
            title: 'Credential verified',
            type: 'credential',
            content: 'Your credential has been validated.',
            reference: 'none',
            accept: 'Thanks',
            decline: 'none'
          })

          const { uuid: cron_uuid } = await makeCronUtil(CronModel)
            .create({
              job_title: 'alert',
              content: alert.uuid
            })
            .then(query => query.toJSON())

          return {
            status: 200,
            error: undefined,
            data: customer,
            alert,
            cron_uuid
          }
        } catch (e) {
          return {
            status: 500,
            error: e.toString(),
            data: undefined
          }
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

            return { status: 200, error: undefined, data: customer }
          }

          return {
            status: 422,
            error: 'Missing params. update query is empty.',
            data: undefined
          }
        }

        return {
          status: 403,
          error: 'Access denied. id param does not match authenticated uuid.',
          data: undefined
        }
      }
      default:
        return {
          status: 200,
          error: undefined,
          data: undefined
        }
    }
  }

  async destroy ({ request }) {
    const { id } = request.params

    switch (request.role) {
      case 'customer': {
        if (request.customer_uuid !== id) {
          await makeCustomerUtil(CustomerModel).deleteById(id)

          return {
            status: 200,
            error: undefined,
            data: `customer ${id} is successfully removed.`
          }
        }

        return {
          status: 403,
          error: 'Access denied. id param does not match authenticated uuid.',
          data: undefined
        }
      }
      case 'admin': {
        await makeCustomerUtil(CustomerModel).deleteById(id)

        return {
          status: 200,
          error: undefined,
          data: `customer ${id} is successfully removed.`
        }
      }
      default:
        return {
          status: 200,
          error: undefined,
          data: undefined
        }
    }
  }
}

module.exports = CustomerController
