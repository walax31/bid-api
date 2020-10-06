"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const createRevokeTokenCronJob = require("../../util/cronjobs/revoke-token-util.func");
const CronJob = require("cron").CronJob;
const TokenModel = use("App/Models/Token");
const Encryption = use("Encryption");

class CronInitiate {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ response }, next, properties = []) {
    // call next to advance the request
    await next();

    if (properties.find((property) => property === "token")) {
      if (response._lazyBody.content.tokens) {
        const { refreshToken } = response._lazyBody.content.tokens;

        const job = createRevokeTokenCronJob(
          CronJob,
          Encryption,
          TokenModel,
          refreshToken,
          1
        );

        job.start();
      }
    }
  }
}

module.exports = CronInitiate;
