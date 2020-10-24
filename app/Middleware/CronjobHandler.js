'use strict'

const createRevokeTokenCronJob = require('../../util/cronjobs/revoke-token-util.func')
const createAssignOrderCronJob = require('../../util/cronjobs/assign-order-util.func')
const createExpireAlertCronJob = require('../../util/cronjobs/expire-alert-util.func')
const CronJobManager = require('cron-job-manager')
const makeCronUtil = require('../../util/cronjobs/cronjob-util.func')
const makeCustomerUtil = require('../../util/CustomerUtil.func')
const makeProductUtil = require('../../util/ProductUtil.func')
const makeOrderUtil = require('../../util/OrderUtil.func')
const makeAlertUtil = require('../../util/alertUtil.func')
const assignTokenUtil = require('../../util/cronjobs/refactor/assignTokenUtil.func')
const assignOrderUtil = require('../../util/cronjobs/refactor/assignOrderUtil.func')
const assignAlertUtil = require('../../util/cronjobs/refactor/assignAlertUtil.func')
const broadcastAlert = require('../../util/ws/broadcast-alert.util.func')

const TokenModel = use('App/Models/Token')
const Encryption = use('Encryption')
const CronModel = use('App/Models/CronJob')
const CustomerModel = use('App/Models/Customer')
const ProductModel = use('App/Models/Product')
const OrderModel = use('App/Models/Order')
const AlertModel = use('App/Models/Alert')
const Ws = use('Ws')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class CronjobHandler {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ response }, next) {
    // call next to advance the request
    await next()

    /**
     * cronjobProperties[] inside response
     * cronjobType: string
     * uuid: string
     * cronjobDate: Date
     * cronjobReferences: Object
     * */

    // eslint-disable-next-line
    const { cronjobProperties } = response._lazyBody.content

    if (response.response.statusCode === 200) {
      cronjobProperties.forEach(prop => {
        switch (prop.cronjobType) {
          case 'token': {
            const dependenciesList = {
              Encryption,
              TokenModel,
              CronModel,
              makeCronUtil,
              CronJobManager
            }
            assignTokenUtil(
              dependenciesList,
              prop.cronjobReferences,
              prop.cronjobDate,
              prop.uuid,
              createRevokeTokenCronJob
            )
            break
          }
          case 'order': {
            const dependenciesList = {
              CronModel,
              makeCronUtil,
              OrderModel,
              makeOrderUtil,
              ProductModel,
              makeProductUtil,
              CustomerModel,
              makeCustomerUtil,
              CronJobManager
            }
            assignOrderUtil(
              dependenciesList,
              prop.cronjobReferences,
              prop.cronjobDate,
              prop.uuid,
              createAssignOrderCronJob
            )
            break
          }
          case 'alert': {
            const dependenciesList = {
              CronModel,
              makeCronUtil,
              AlertModel,
              makeAlertUtil,
              broadcastAlert,
              Ws,
              CronJobManager
            }
            assignAlertUtil(
              dependenciesList,
              prop.cronjobReferences,
              prop.cronjobDate,
              prop.uuid,
              createExpireAlertCronJob
            )
            break
          }
          default:
            // eslint-disable-next-line
            console.log('Cronjob was not created successfully.')
        }
      })
      // eslint-disable-next-line
      response._lazyBody.content.cronjobProperties = undefined
    }
  }
}

module.exports = CronjobHandler
