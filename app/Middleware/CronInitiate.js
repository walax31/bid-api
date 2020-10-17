'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const createRevokeTokenCronJob = require('../../util/cronjobs/revoke-token-util.func')
const createAssignOrderCronJob = require('../../util/cronjobs/assign-order-util.func')
const CronJobManager = require('cron-job-manager')
const makeCronUtil = require('../../util/cronjobs/cronjob-util.func')
const makeCustomerUtil = require('../../util/CustomerUtil.func')
const makeProductUtil = require('../../util/ProductUtil.func')
const makeOrderUtil = require('../../util/OrderUtil.func')

const TokenModel = use('App/Models/Token')
const Encryption = use('Encryption')
const CronModel = use('App/Models/CronJob')
const CustomerModel = use('App/Models/Customer')
const ProductModel = use('App/Models/Product')
const OrderModel = use('App/Models/Order')

class CronInitiate {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ response }, next, properties = []) {
    // call next to advance the request
    await next()

    if (properties.find(property => property === 'token')) {
      // eslint-disable-next-line
      if (response._lazyBody.content.tokens) {
        // eslint-disable-next-line
        const { refreshToken, uuid } = response._lazyBody.content.tokens

        if (!global.CronJobManager) {
          global.CronJobManager = new CronJobManager(
            uuid,
            new Date(new Date().setMinutes(new Date().getMinutes() + 1)),
            () =>
              createRevokeTokenCronJob(
                Encryption,
                TokenModel,
                CronModel,
                makeCronUtil,
                uuid,
                refreshToken
              ),
            {
              start: true,
              timeZone: 'Asia/Bangkok'
            }
          )
        } else if (!global.CronJobManager.exists(uuid)) {
          global.CronJobManager.add(
            uuid,
            new Date(new Date().setMinutes(new Date().getMinutes() + 1)),
            () =>
              createRevokeTokenCronJob(
                Encryption,
                TokenModel,
                CronModel,
                makeCronUtil,
                uuid,
                refreshToken
              ),
            {
              start: true,
              timeZone: 'Asia/Bangkok'
            }
          )
        } else {
          global.CronJobManager.update(
            uuid,
            new Date(new Date().setMinutes(new Date().getMinutes() + 1)),
            () =>
              createRevokeTokenCronJob(
                Encryption,
                TokenModel,
                CronModel,
                makeCronUtil,
                uuid,
                refreshToken
              )
          )
        }
      }
    } else if (properties.find(property => property === 'order')) {
      // eslint-disable-next-line
      if (response._lazyBody.content.data) {
        const {
          order_quantity = 1
          // eslint-disable-next-line
        } = response._lazyBody.content.data.toJSON()
        // eslint-disable-next-line
        const { cron_uuid } = response._lazyBody.content

        if (!global.CronJobManager) {
          global.CronJobManager = new CronJobManager(
            cron_uuid,
            new Date(new Date().setMinutes(new Date().getMinutes() + 1)),
            () =>
              createAssignOrderCronJob(
                CronModel,
                makeCronUtil,
                cron_uuid,
                OrderModel,
                makeOrderUtil,
                ProductModel,
                makeProductUtil,
                CustomerModel,
                makeCustomerUtil,
                order_quantity
              ),
            {
              start: true,
              timeZone: 'Asia/Bangkok'
            }
          )
        } else {
          global.CronJobManager.add(
            cron_uuid,
            new Date(new Date().setMinutes(new Date().getMinutes() + 1)),
            () =>
              createAssignOrderCronJob(
                CronModel,
                makeCronUtil,
                cron_uuid,
                OrderModel,
                makeOrderUtil,
                ProductModel,
                makeProductUtil,
                CustomerModel,
                makeCustomerUtil,
                order_quantity
              ),
            {
              start: true,
              timeZone: 'Asia/Bangkok'
            }
          )
        }
      } else {
        // eslint-disable-next-line
        console.log('Cronjob was not created successfully.')
      }
    } else if (properties.find(property => property === 'alert')) {
      // eslint-disable-next-line
      if (response._lazyBody.content.data) {
        // eslint-disable-next-line
        const cron_uuid = response._lazyBody.content
      }
    }
  }
}

module.exports = CronInitiate
