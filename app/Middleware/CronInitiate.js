'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const createRevokeTokenCronJob = require('../../util/cronjobs/revoke-token-util.func')
// FIXME: Remove before production
const CronJobManager = require('cron-job-manager')
const TokenModel = use('App/Models/Token')
const Encryption = use('Encryption')
const CronModel = use('App/Models/CronJob')
const makeCronUtil = require('../../util/cronjobs/cronjob-util.func')

class CronInitiate {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ response }, next, properties = []) {
    // call next to advance the request
    await next()

    if (properties.find((property) => property === 'token')) {
      if (response._lazyBody.content.tokens) {
        console.log(response._lazyBody.content.tokens, global.CronJobManager)
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
        } else {
          if (!global.CronJobManager.exists(uuid)) {
            console.log(uuid)
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
            console.log(uuid)
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
                ),
              {
                start: true,
                timeZone: 'Asia/Bangkok'
              }
            )
          }
        }
      }
    }
  }
}

module.exports = CronInitiate
