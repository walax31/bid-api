'use strict'

const makeCustomerUtil = require('../../../util/CustomerUtil.func')
const makeProductUtil = require('../../../util/ProductUtil.func')
const { v4: uuidv4 } = require('uuid')

const Drive = use('Drive')
const CustomerModel = use('App/Models/Customer')
const ProductModel = use('App/Models/Product')

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

        const customer = await makeCustomerUtil(CustomerModel).updateById(customer_uuid, { path_to_credential: fileList.length ? fileList.join(',') : undefined })

        response.send({ status: 200, error: undefined, data: customer })
      } catch (error) {
        response.status(400).send({
          status: 400,
          error: error.toString(),
          data: undefined
        })
      }
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
