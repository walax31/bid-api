'use strict'

const makeUserUtil = require('../../../util/UserUtil.func')
const makeCustomerUtil = require('../../../util/CustomerUtil.func')
const makeProductUtil = require('../../../util/ProductUtil.func')
const { v4: uuidv4 } = require('uuid')
const makeAlertUtil = require('../../../util/alertUtil.func')
const makeCronUtil = require('../../../util/cronjobs/cronjob-util.func')

const Drive = use('Drive')
const UserModel = use('App/Models/User')
const CustomerModel = use('App/Models/Customer')
const ProductModel = use('App/Models/Product')
const AlertModel = use('App/Models/Alert')
const CronModel = use('App/Models/CronJob')

function validateFileExtension (file) {
  if (
    !(file.extname === 'png') &&
    !(file.extname === 'jpg') &&
    !(file.extname === 'jpeg')
  ) {
    throw new Error('Validation failed. contain illegal file type.')
  }
}

class ImageController {
  async downloadCredentialImage ({ request, response }) {
    const { params, role, customer_uuid } = request

    const { id, section } = params

    switch (role) {
      case 'admin': {
        const file = await Drive.disk('s3').getSignedUrl(`${section}/${id}`)

        return response.send({
          status: 200,
          data: file
        })
      }
      case 'customer': {
        if (section === 'credential') {
          // eslint-disable-next-line
          const customer = await makeCustomerUtil(
            CustomerModel).credentialBelongToCustomer(customer_uuid, id)

          if (!customer) {
            return response.status(403).send({
              status: 403,
              error: 'Access denied. credential does not belong to customer.',
              data: undefined
            })
          }
        }

        const file = await Drive.disk('s3').getSignedUrl(`${section}/${id}`)

        return response.send({
          status: 200,
          data: file
        })
      }
      default:
        return response.status(204).send({
          status: 204,
          error: undefined,
          data: undefined
        })
    }
  }

  async downloadProductImage ({ request, response }) {
    const { section, product_uuid, id } = request.params

    const file = await Drive.disk('s3').getSignedUrl(`${section}/${product_uuid}/${id}`)

    return response.send({
      status: 200,
      data: file
    })
  }

  async uploadCredentialImage ({ request, response }) {
    const { user_uuid, customer_uuid } = request

    if (customer_uuid) {
      const fileList = []

      try {
        request.multipart.file(
          'credential_image',
          { types: ['image'], size: '2mb', extnames: ['png', 'jpg', 'jpeg'] },
          async file => {
            validateFileExtension(file)

            await Drive.disk('s3').put(
              `credential/${user_uuid}.${file.extname}`,
              file.stream
            )

            fileList.push(`${user_uuid}.${file.extname}`)
          }
        )

        await request.multipart.process()

        const flaggedUser = await makeUserUtil(UserModel).flagSubmition(request.user_uuid)

        if (!flaggedUser) {
          return response.status(500).send({
            status: 500,
            error: 'Internal error. failed to flag user submittion.',
            data: undefined
          })
        }

        const admins = await makeUserUtil(UserModel).getAllAdminId()

        if (!admins.length) {
          return response.status(404).send({
            status: 404,
            error:
              "Admin not found. can't submit credential as admin account has not been created yet.",
            data: undefined
          })
        }

        const alertPromises = admins.map(({ uuid: admin_uuid }) =>
          makeAlertUtil(AlertModel)
            .create({
              expiration_date: new Date(new Date().setHours(new Date().getHours() + 72)),
              user_uuid: admin_uuid,
              title: 'customer verification',
              type: 'verification',
              content: 'This customer credential need validation.',
              reference: user_uuid,
              accept: 'View',
              decline: 'Reject'
            })
            .then(query => query.toJSON()))

        const alerts = await Promise.all(alertPromises)

        const cronjobPromises = alerts.map(({ uuid }) =>
          makeCronUtil(CronModel)
            .create({
              job_title: 'alert',
              content: uuid
            })
            .then(query => query.toJSON()))

        const cronjobs = await Promise.all(cronjobPromises)

        const customer = await makeCustomerUtil(CustomerModel).updateById(customer_uuid, { path_to_credential: fileList.length ? fileList.join(',') : undefined })
        console.log(alerts, cronjobs)

        return response.send({
          status: 200,
          error: undefined,
          data: customer,
          alerts,
          cronjobs
        })
      } catch (error) {
        return response.status(400).send({
          status: 400,
          error: error.toString(),
          data: undefined
        })
      }
    } else {
      return response.status(404).send({
        status: 404,
        error:
          'Credential not found. you have to submit credential data first.',
        data: undefined
      })
    }
  }

  async uploadProductImage ({ request, response }) {
    const { customer_uuid, params } = request

    const { product_uuid } = params

    // eslint-disable-next-line
    const productBelongToCustomer = await makeCustomerUtil(
      CustomerModel).findProductOnAuthUser(customer_uuid, product_uuid)

    if (productBelongToCustomer) {
      const fileList = await makeProductUtil(ProductModel)
        .getById(product_uuid)
        .then(query => {
          const { product_image } = query.toJSON()

          return product_image ? product_image.split(',') : []
        })

      try {
        request.multipart.file(
          'product_image',
          { types: ['image'], size: '2mb', extnames: ['png', 'jpg', 'jpeg'] },
          async file => {
            validateFileExtension(file)

            const uuid = uuidv4()

            await Drive.disk('s3').put(
              `product/${product_uuid}/${uuid}.${file.extname}`,
              file.stream
            )

            fileList.push(`${uuid}.${file.extname}`)
          }
        )

        await request.multipart.process()

        const product = await makeProductUtil(ProductModel).updateById(product_uuid, { product_image: fileList.length ? fileList.join(',') : undefined })

        response.send({ status: 200, error: undefined, data: product })
      } catch (error) {
        response.status(400).send({
          status: 400,
          error: error.toString(),
          data: undefined
        })
      }
    } else {
      response.status(403).send({
        status: 403,
        error: 'Access denied. product does not belong to customer.',
        data: undefined
      })
    }
  }
}

module.exports = ImageController
