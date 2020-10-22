'use strict'

const ProductDetailModel = use('App/Models/ProductDetail')
const CustomerModel = use('App/Models/Customer')
const ProductModel = use('App/Models/Product')
const CronModel = use('App/Models/CronJob')

const makeProductDetailUtil = require('../../../util/ProductDetailUtil.func')
const makeProductUtil = require('../../../util/ProductUtil.func')
const makeCustomerUtil = require('../../../util/CustomerUtil.func')
const makeCronUtil = require('../../../util/cronjobs/cronjob-util.func')

class ProductDetailController {
  async index ({ request }) {
    const { references, page, per_page } = request.qs

    // eslint-disable-next-line
    const { rows, pages } = await makeProductDetailUtil(
      ProductDetailModel).getAll(references, page, per_page)

    return { status: 200, error: undefined, pages, data: rows }
  }

  async show ({ request }) {
    const { params, qs } = request

    const { id } = params

    const { references } = qs

    const productDetail = await makeProductDetailUtil(ProductDetailModel).getById(id, references)

    return { status: 200, error: undefined, data: productDetail || {} }
  }

  async store ({ request }) {
    const { body, qs } = request

    const {
      uuid,
      product_price,
      product_bid_start,
      product_bid_increment,
      product_description
    } = body

    const { references } = qs

    // eslint-disable-next-line
    const existingProduct = await makeCustomerUtil(
      CustomerModel).findProductOnAuthUser(request.customer_uuid, uuid)

    if (!existingProduct) {
      return {
        status: 404,
        error:
          'Product not found. these product does not seems like it belong to your or product does not seem to exist.',
        data: undefined
      }
    }

    const { end_date } = existingProduct.toJSON()

    const productDetail = await makeProductDetailUtil(ProductDetailModel).create(
      {
        uuid,
        product_price,
        product_bid_start,
        product_bid_increment,
        product_description
      },
      references
    )

    const flaggedProduct = await makeProductUtil(ProductModel).flagProductAsBiddable(uuid)

    if (!flaggedProduct) {
      return {
        status: 500,
        error: 'Internal error. failed to flag product as biddable.'
      }
    }

    const cron = await makeCronUtil(CronModel).create(
      { job_title: 'order', content: uuid },
      ''
    )

    return {
      status: 200,
      error: undefined,
      data: productDetail,
      cron_uuid: cron.uuid,
      end_date
    }
  }

  async update ({ request }) {
    const { body, params, qs } = request

    const { id } = params

    const { references } = qs

    const product = await makeProductDetailUtil(ProductDetailModel).getById(id)

    if (!product) {
      return {
        status: 404,
        error: 'Product not found. product you are looking for does not exist.',
        data: undefined
      }
    }

    const {
      product_price,
      product_bid_start,
      product_bid_increment,
      product_description
    } = body

    const productDetail = await makeProductDetailUtil(ProductDetailModel).updateById(
      id,
      {
        product_price,
        product_bid_start,
        product_bid_increment,
        product_description
      },
      references
    )

    return { status: 200, error: undefined, data: productDetail }
  }

  async destroy ({ request }) {
    const { id } = request.params

    await makeProductDetailUtil(ProductDetailModel).deleteById(id)

    return {
      status: 200,
      error: undefined,
      data: `productDetail ${id} is successfully removed.`
    }
  }
}

module.exports = ProductDetailController
