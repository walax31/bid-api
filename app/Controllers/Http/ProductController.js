'use strict'

const Product = use('App/Models/Product')
const Customer = use('App/Models/Customer')
const Drive = use('Drive')

const makeProductUtil = require('../../../util/ProductUtil.func')
const makeCustomerUtil = require('../../../util/CustomerUtil.func')

class ProductController {
  async index ({ request }) {
    const { references, page, per_page } = request.qs

    switch (request.role) {
      case 'admin': {
        const products = await makeProductUtil(Product).getAll(
          references,
          page,
          per_page
        )

        return {
          status: 200,
          error: undefined,
          pages: products.pages,
          data: products.rows
        }
      }
      default: {
        const biddableProducts = await makeProductUtil(Product).bulkHasBiddableFlag(references, page, per_page)

        return {
          status: 200,
          error: undefined,
          pages: biddableProducts.pages,
          data: biddableProducts.rows
        }
      }
    }
  }

  async show ({ request }) {
    const { params, qs } = request

    const { id } = params

    const { references } = qs

    switch (request.role) {
      case 'admin': {
        const product = await makeProductUtil(Product).getById(id, references)

        return { status: 200, error: undefined, data: product || {} }
      }
      default: {
        const biddableProduct = await makeProductUtil(Product).hasBiddableFlag(
          id,
          references
        )

        return {
          status: 200,
          error: undefined,
          data: biddableProduct || {}
        }
      }
    }
  }

  async store ({ request }) {
    const { body, qs } = request

    const { product_name, end_date, stock } = body

    const { references } = qs

    const product = await makeProductUtil(Product).create(
      {
        customer_uuid: request.customer_uuid,
        product_name,
        end_date,
        stock
      },
      references
    )

    return {
      status: 200,
      error: undefined,
      data: product
    }
  }

  async update ({ request }) {
    const { body, params, qs } = request

    const { id } = params

    const { references } = qs

    const { product_name, end_date, stock } = body

    switch (request.role) {
      case 'admin': {
        const product = await makeProductUtil(Product).updateById(
          id,
          { product_name, end_date, stock },
          references
        )

        return { status: 200, error: undefined, data: product }
      }
      case 'customer': {
        const { product_image } = await makeCustomerUtil(Customer)
          .findProductOnAuthUser(request.customer_uuid, id)
          .then(response => response.toJSON())

        const productExist = await makeCustomerUtil(Customer)
          .findProductOnAuthUser(request.customer_uuid, id)
          .then(response => response.toJSON())

        if (productExist) {
          const fileList = []

          const new_product_name = product_name || productExist.product_name

          try {
            request.multipart.file(
              'product_image',
              {
                types: ['image'],
                size: '2mb',
                extnames: ['png', 'gif', 'jpeg', 'jpg']
              },
              async file => {
                if (
                  !(file.extname === 'png') &&
                  !(file.extname === 'jpg') &&
                  !(file.extname === 'jpeg')
                ) {
                  return {
                    status: 422,
                    error: 'Validation failed. contain illegal file type.',
                    data: undefined
                  }
                }

                await Drive.disk('s3').put(
                  `${new_product_name}.${file.extname}`,
                  file.stream
                )

                fileList.push(`${new_product_name}.${file.extname}`)
              }
            )

            await request.multipart.process()
          } catch (error) {
            if (!error.message === 'unsupported content-type') {
              return { status: 500, error, data: undefined }
            }
          }

          const product = await makeProductUtil(Product).updateById(
            id,
            {
              product_name: new_product_name,
              stock,
              product_image: fileList.length
                ? fileList.join(',')
                : product_image
            },
            references
          )

          return { status: 200, error: undefined, data: product }
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
      case 'admin': {
        await makeProductUtil(Product).deleteById(id)

        return {
          status: 200,
          error: undefined,
          data: { message: `product ${id} is successfully removed.` }
        }
      }
      case 'customer': {
        if (request.customer_uuid === id) {
          await makeProductUtil(Product).deleteById(id)

          return {
            status: 200,
            error: undefined,
            data: { message: `product ${id} is successfully removed.` }
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
}

module.exports = ProductController
