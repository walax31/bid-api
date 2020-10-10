'use strict'

const Drive = use('Drive')
const Customer = use('App/Models/Customer')
const User = use('App/Models/User')
const makeCustomerUtil = require('../../../util/CustomerUtil.func')
const makeUserUtil = require('../../../util/UserUtil.func')

class CustomerController {
  async index({ request }) {
    const { references, page, per_page } = request.qs

    const { rows, pages } = await makeCustomerUtil(Customer).getAll(
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

  async show({ request }) {
    const { params, qs } = request

    const { id } = params

    const { references } = qs

    const customer = await makeCustomerUtil(Customer).getById(id, references)

    return { status: 200, error: undefined, data: customer || {} }
  }

  async store({ request }) {
    const { body, qs } = request

    const { first_name, last_name } = body

    const { references } = qs

    const customer = await makeCustomerUtil(Customer).create(
      {
        user_uuid: request.user_uuid,
        first_name,
        last_name
      },
      references
    )

    const flaggedUser = await makeUserUtil(User).flagSubmition(
      request.user_uuid
    )

    if (!flaggedUser)
      return {
        status: 500,
        error: 'Internal error. failed to flag user submittion.',
        data: undefined
      }

    return {
      status: 200,
      error: undefined,
      data: customer
    }
  }

  async update({ request }) {
    const { body, params, qs } = request

    const { id } = params

    const { references } = qs

    const { first_name, last_name } = body

    switch (request.role) {
      case 'admin':
        const { customer_uuid } = await makeUserUtil(User)
          .hasSubmittionFlagged(id)
          .then((response) => response.toJSON())

        if (!customer_uuid)
          return {
            status: 404,
            error: 'User not found. this user never submitted credential.',
            data: undefined
          }

        const { is_validated } = await makeCustomerUtil(
          Customer
        ).validateUserCredential(customer_uuid, references)

        return {
          status: 200,
          error: undefined,
          data: { customer_uuid, is_validated }
        }
      case 'customer':
        if (request.customer_uuid === id) {
          const username = request.username

          const fileList = []

          try {
            request.multipart.file(
              'credential_image',
              { types: ['image'], size: '2mb', extnames: ['png', 'gif'] },
              async (file) => {
                if (
                  !(file.extname === 'png') &&
                  !(file.extname === 'jpg') &&
                  !(file.extname === 'jpeg')
                )
                  return {
                    status: 422,
                    error: 'Validation failed. contain illegal file type.',
                    data: undefined
                  }

                await Drive.disk('s3').put(
                  `${username}.${file.extname}`,
                  file.stream
                )

                fileList.push(`${username}.${file.extname}`)
              }
            )

            await request.multipart.process()
          } catch (error) {
            if (!error.message === 'unsupported content-type')
              return { status: 500, error, data: undefined }
          }

          if (first_name || last_name || fileList.length) {
            const customer = await makeCustomerUtil(Customer).updateById(
              request.customer_uuid,
              {
                first_name,
                last_name,
                path_to_credential: fileList.length
                  ? fileList.join(',')
                  : undefined
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
  }

  async destroy({ request }) {
    const { id } = request.params

    switch (request.role) {
      case 'admin':
        await makeCustomerUtil(Customer).deleteById(id)

        return {
          status: 200,
          error: undefined,
          data: `customer ${id} is successfully removed.`
        }
      case 'customer':
        if (request.customer_uuid === id) {
          await makeCustomerUtil(Customer).deleteById(id)

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
      default:
    }
  }
}

module.exports = CustomerController
