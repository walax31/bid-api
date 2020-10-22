'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const createRevokeTokenCronJob = require('../../util/cronjobs/revoke-token-util.func')
const createAssignOrderCronJob = require('../../util/cronjobs/assign-order-util.func')
const createExpireAlertCronJob = require('../../util/cronjobs/expire-alert-util.func')
const CronJobManager = require('cron-job-manager')
const makeCronUtil = require('../../util/cronjobs/cronjob-util.func')
const makeCustomerUtil = require('../../util/CustomerUtil.func')
const makeProductUtil = require('../../util/ProductUtil.func')
const makeOrderUtil = require('../../util/OrderUtil.func')
const makeAlertUtil = require('../../util/alertUtil.func')
const broadcastAlert = require('../../util/ws/broadcast-alert.util.func')

const TokenModel = use('App/Models/Token')
const Encryption = use('Encryption')
const CronModel = use('App/Models/CronJob')
const CustomerModel = use('App/Models/Customer')
const ProductModel = use('App/Models/Product')
const OrderModel = use('App/Models/Order')
const AlertModel = use('App/Models/Alert')
const Ws = use('Ws')

class CronInitiate {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ response }, next, properties = []) {
    // call next to advance the request
    await next()

    // eslint-disable-next-line
    const { alert } = response._lazyBody.content
    // eslint-disable-next-line
    const { cronjobs } = response._lazyBody.content

    if (properties.find(property => property === 'token')) {
      // eslint-disable-next-line
      if (response._lazyBody.content.tokens) {
        // eslint-disable-next-line
        const { refreshToken, uuid } = response._lazyBody.content.tokens
        // eslint-disable-next-line
        const { cron_uuid } = response._lazyBody.content

        if (!global.CronJobManager) {
          global.CronJobManager = new CronJobManager(
            cron_uuid,
            new Date(new Date().setDate(new Date().getDate() + 7)),
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
        } else if (!global.CronJobManager.exists(cron_uuid)) {
          global.CronJobManager.add(
            cron_uuid,
            new Date(new Date().setDate(new Date().getDate() + 7)),
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
            cron_uuid,
            new Date(new Date().setDate(new Date().getDate() + 7)),
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
        const { cron_uuid, end_date } = response._lazyBody.content

        if (!global.CronJobManager) {
          global.CronJobManager = new CronJobManager(
            cron_uuid,
            new Date(end_date),
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
            new Date(end_date),
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
    } else if (properties.find(property => property === 'alert') && alert) {
      // eslint-disable-next-line
      if (response._lazyBody.content.data) {
        const {
          uuid: cron_uuid
          // eslint-disable-next-line
        } = response._lazyBody.content.cron
        if (!global.CronJobManager) {
          global.CronJobManager = new CronJobManager(
            cron_uuid,
            new Date(new Date().setHours(new Date().getHours() + 24)),
            () =>
              createExpireAlertCronJob(
                CronModel,
                makeCronUtil,
                cron_uuid,
                AlertModel,
                makeAlertUtil,
                alert,
                broadcastAlert,
                Ws
              ),
            {
              start: true,
              timeZone: 'Asia/Bangkok'
            }
          )
        } else {
          global.CronJobManager.add(
            cron_uuid,
            new Date(new Date().setHours(new Date().getHours() + 24)),
            () =>
              createExpireAlertCronJob(
                CronModel,
                makeCronUtil,
                cron_uuid,
                AlertModel,
                makeAlertUtil,
                alert,
                broadcastAlert,
                Ws
              ),
            {
              start: true,
              timeZone: 'Asia/Bangkok'
            }
          )
        }
        // eslint-disable-next-line
        response._lazyBody.content.alert = undefined
      }
    } else if (
      properties.find(property => property === 'alert') &&
      cronjobs &&
      cronjobs.length
    ) {
      // eslint-disable-next-line
      if (response._lazyBody.content.data) {
        // eslint-disable-next-line
        const { alerts } = response._lazyBody.content
        cronjobs.forEach(({ uuid: cron_uuid }, index) => {
          if (!global.CronJobManager) {
            global.CronJobManager = new CronJobManager(
              cron_uuid,
              new Date(new Date().setHours(new Date().getHours() + 24)),
              () =>
                createExpireAlertCronJob(
                  CronModel,
                  makeCronUtil,
                  cron_uuid,
                  AlertModel,
                  makeAlertUtil,
                  alerts[index]
                ),
              {
                start: true,
                timeZone: 'Asia/Bangkok'
              }
            )
          } else {
            global.CronJobManager.add(
              cron_uuid,
              new Date(new Date().setHours(new Date().getHours() + 24)),
              () =>
                createExpireAlertCronJob(
                  CronModel,
                  makeCronUtil,
                  cron_uuid,
                  AlertModel,
                  makeAlertUtil,
                  alerts[index]
                ),
              {
                start: true,
                timeZone: 'Asia/Bangkok'
              }
            )
          }
        })
        // eslint-disable-next-line
        response._lazyBody.content.alerts = undefined
        // eslint-disable-next-line
        response._lazyBody.content.cronjobs = undefined
      } else {
        // eslint-disable-next-line
        console.log('Cronjob was not created successfully.')
      }
    }
  }
}

module.exports = CronInitiate
