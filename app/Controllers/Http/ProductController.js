'use strict'

const ProductModel = use('App/Models/Product')
const CustomerModel = use('App/Models/Customer')
const TagModel = use('App/Models/Tag')
const SpecificationModel = use('App/Models/Specification')
const Drive = use('Drive')

const makeProductUtil = require('../../../util/ProductUtil.func')
const makeCustomerUtil = require('../../../util/CustomerUtil.func')

const AVIALABLE_TYPE = [
  'color',
  'size',
  'width',
  'height',
  'volumn',
  'weight',
  'brand',
  'model'
]

class ProductController {
  async index({ request, response }) {
    const { references, page, per_page } = request.qs

    switch (request.role) {
      case 'admin': {
        const products = await makeProductUtil(ProductModel).getAll(
          references,
          page,
          per_page
        )

        return response.send({
          status: 200,
          error: undefined,
          pages: products.pages,
          data: products.rows
        })
      }
      default: {
        // eslint-disable-next-line
        const biddableProducts = await makeProductUtil(
          ProductModel
        ).bulkHasBiddableFlag(references, page, per_page)

        return response.send({
          status: 200,
          error: undefined,
          pages: biddableProducts.pages,
          data: biddableProducts.rows
        })
      }
    }
  }

  async show({ request, response }) {
    const { params, qs } = request

    const { id } = params

    const { references } = qs

    switch (request.role) {
      case 'admin': {
        const product = await makeProductUtil(ProductModel).getById(
          id,
          references
        )

        return response.send({
          status: 200,
          error: undefined,
          data: product || {}
        })
      }
      default: {
        const biddableProduct = await makeProductUtil(
          ProductModel
        ).hasBiddableFlag(id, references)

        return response.send({
          status: 200,
          error: undefined,
          data: biddableProduct || {}
        })
      }
    }
  }

  async getByTags({ request, response }) {
    const { tags = '', references = '', page = 1, per_page = 10 } = request.qs

    const { rows, pages } = await makeProductUtil(ProductModel).getByTags(
      tags,
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

  async store({ request, response }) {
    const { body, qs } = request

    const { product_name, end_date, stock } = body

    const { references } = qs

    const product = await makeProductUtil(ProductModel).create(
      {
        customer_uuid: request.customer_uuid,
        product_name,
        end_date,
        stock
      },
      references
    )

    return response.send({
      status: 200,
      error: undefined,
      data: product
    })
  }

  async addTag({ request, response }) {
    const { body, qs, params } = request

    const { tag_name } = body

    const { references } = qs

    const { id } = params

    try {
      const tag = await TagModel.findOrCreate({ tag_name }, { tag_name })

      const product = await ProductModel.findOrFail(id)

      await product.tags().attach([tag.uuid])

      const taggedProduct = await makeProductUtil(ProductModel).getById(
        id,
        references
      )

      return response.send({
        status: 200,
        error: undefined,
        data: taggedProduct
      })
    } catch (e) {
      return response.status(403).send({
        status: 404,
        error: e.toString(),
        data: undefined
      })
    }
  }

  async removeTag({ request, response }) {
    const { qs, params } = request

    const { references } = qs

    const { id, tag_name } = params

    try {
      const tag = await TagModel.findByOrFail({ tag_name })

      const product = await ProductModel.findOrFail(id)

      await product.tags().detach([tag.uuid])

      const taggedProduct = await makeProductUtil(ProductModel).getById(
        id,
        references
      )

      return response.send({
        status: 200,
        error: undefined,
        data: taggedProduct
      })
    } catch (e) {
      return response.status(404).send({
        status: 404,
        error: e.toString(),
        data: undefined
      })
    }
  }

  async addSpecification({ request, response }) {
    const { body, qs, params } = request

    const { name, type } = body

    const { references } = qs

    const { id } = params

    if (!AVIALABLE_TYPE.find((spec) => spec === type)) {
      return response
        .status(404)
        .send({ status: 404, error: 'Type not found.', data: undefined })
    }

    try {
      const specification = await SpecificationModel.findOrCreate(
        {
          name,
          type
        },
        { name, type }
      )

      const product = await ProductModel.findOrFail(id)

      await product.specifications().attach([specification.uuid])

      const specifiedProduct = await makeProductUtil(ProductModel).getById(
        id,
        references
      )

      return response.send({
        status: 200,
        error: undefined,
        data: specifiedProduct
      })
    } catch (e) {
      return response.status(404).send({
        status: 404,
        error: e.toString(),
        data: undefined
      })
    }
  }

  async removeSpecification({ request, response }) {
    const { qs, params } = request

    const { references } = qs

    const { id, name, type } = params

    try {
      const specification = await SpecificationModel.findByOrFail({
        name,
        type
      })

      const product = await ProductModel.findOrFail(id)

      await product.specifications().detach([specification.uuid])

      const specifiedProduct = await makeProductUtil(ProductModel).getById(
        id,
        references
      )

      return response.send({
        status: 200,
        error: undefined,
        data: specifiedProduct
      })
    } catch (e) {
      return response.status(404).send({
        status: 404,
        error: e.toString(),
        data: undefined
      })
    }
  }

  async update({ request, response }) {
    const { body, params, qs } = request

    const { id } = params

    const { references } = qs

    const { product_name, end_date, stock } = body

    switch (request.role) {
      case 'admin': {
        const product = await makeProductUtil(ProductModel).updateById(
          id,
          { product_name, end_date, stock },
          references
        )

        return response.send({ status: 200, error: undefined, data: product })
      }
      case 'customer': {
        const { product_image } = await makeCustomerUtil(CustomerModel)
          .findProductOnAuthUser(request.customer_uuid, id)
          .then((query) => query.toJSON())

        const productExist = await makeCustomerUtil(CustomerModel)
          .findProductOnAuthUser(request.customer_uuid, id)
          .then((query) => query.toJSON())

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
              // eslint-disable-next-line
              async (file) => {
                if (
                  !(file.extname === 'png') &&
                  !(file.extname === 'jpg') &&
                  !(file.extname === 'jpeg')
                ) {
                  return response.status(422).send({
                    status: 422,
                    error: 'Validation failed. contain illegal file type.',
                    data: undefined
                  })
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
              return response
                .status(500)
                .send({ status: 500, error, data: undefined })
            }
          }

          const product = await makeProductUtil(ProductModel).updateById(
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

          return response.send({ status: 200, error: undefined, data: product })
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

  async destroy({ request, response }) {
    const { id } = request.params

    switch (request.role) {
      case 'admin': {
        await makeProductUtil(ProductModel).deleteById(id)

        return response.send({
          status: 200,
          error: undefined,
          data: { message: `product ${id} is successfully removed.` }
        })
      }
      case 'customer': {
        if (request.customer_uuid === id) {
          await makeProductUtil(ProductModel).deleteById(id)

          return response.send({
            status: 200,
            error: undefined,
            data: { message: `product ${id} is successfully removed.` }
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
}

module.exports = ProductController
