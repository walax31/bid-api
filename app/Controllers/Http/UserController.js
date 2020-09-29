"use strict";

const Env = use("Env");
const CronJob = require("cron").CronJob;
const Encryption = use("Encryption");
const userValidator = require("../../../service/userValidator");
const User = use("App/Models/User");
const Customer = use("App/Models/Customer");
const Token = use("App/Models/Token");
const makeUserUtil = require("../../../util/UserUtil.func");
const numberTypeParamValidator = require("../../../util/numberTypeParamValidator.func");
const performAuthentication = require("../../../util/authenticate.func");
const startRevokeTokenCronsJob = require("../../../util/cronjobs/revoke-token-util.func");

class UserController {
  async index({ auth, request }) {
    const { references, page, per_page } = request.qs;

    const { admin, error } = await performAuthentication(auth).validateAdmin();

    if (error)
      return {
        status: 403,
        error: "Access denied. authentication failed.",
        data: undefined,
      };

    if (admin) {
      const { rows, pages } = await makeUserUtil(User).getAll(
        references,
        page,
        per_page
      );

      return { status: 200, error: undefined, pages, data: rows };
    }

    return {
      status: 403,
      error: "Access denied. admin validation failed.",
      data: undefined,
    };
  }

  async show({ auth, request }) {
    const { params, qs } = request;

    const { id } = params;

    const { references } = qs;

    const { admin, error } = await performAuthentication(auth).validateAdmin();

    if (error)
      return {
        status: 403,
        error: "Access denied. authentication failed.",
        data: undefined,
      };

    // const validateValue = numberTypeParamValidator(id);

    // if (validateValue.error)
    //   return { status: 422, error: validateValue.error, date: undefined };

    if (admin) {
      const data = (await makeUserUtil(User).getById(id, references)) || {};

      return {
        status: 200,
        error: undefined,
        data,
      };
    }

    const { user_uuid } = await performAuthentication(auth).validateUniqueID();

    if (user_uuid === id) {
      const data =
        (await makeUserUtil(User).getById(user_uuid, references)) || {};

      return {
        status: 200,
        error: undefined,
        data,
      };
    }

    return {
      status: 403,
      error: "Access denied. id param does not match authenticated id.",
      data: undefined,
    };
  }

  async store({ auth, request }) {
    const { body, qs } = request;

    const { username, email, password, key } = body;

    const { references } = qs;

    const { error } = await performAuthentication(auth).authenticate();

    if (!error)
      return {
        status: 403,
        error: "Access denied. you are already logged in.",
        data: undefined,
      };

    const validation = await userValidator(request.body);

    if (validation.error) {
      return { status: 422, error: validation.error, data: undefined };
    }

    const data = await makeUserUtil(User).create(
      {
        username,
        email,
        password,
        is_admin: key === Env.get("APP_KEY"),
      },
      references
    );

    const { tokens } = await performAuthentication(auth).login({
      username,
      password,
    });

    const job = startRevokeTokenCronsJob(
      CronJob,
      Encryption,
      Token,
      tokens.refreshToken,
      1
    );

    job.start();

    return {
      status: 200,
      error: undefined,
      data,
      tokens,
    };
  }

  async update({ auth, request }) {
    const { body, params, qs } = request;

    const { id } = params;

    const { references } = qs;

    const { email } = body;

    const { admin } = await performAuthentication(auth).validateAdmin();

    // const validateValue = numberTypeParamValidator(id);

    // if (validateValue.error)
    //   return { status: 422, error: validateValue.error, date: undefined };

    if (admin) {
      const user = await makeUserUtil(User).updateById(
        id,
        { email },
        references
      );

      return { status: 200, error: undefined, data: user };
    }

    const { user_uuid } = await performAuthentication(auth).validateUniqueID();

    if (user_uuid === id) {
      const user = await makeUserUtil(User).updateById(
        user_uuid,
        { email },
        references
      );

      return { status: 200, error: undefined, data: user };
    }

    return {
      status: 403,
      error: "Access denied. id param does not match authenticated id.",
      data: undefined,
    };
  }

  async destroy({ auth, request }) {
    const { id } = request.params;

    const { admin } = await performAuthentication(auth).validateAdmin();

    // const validateValue = numberTypeParamValidator(id);

    // if (validateValue.error)
    //   return { status: 422, error: validateValue.error, date: undefined };

    if (admin) {
      const user = await makeUserUtil(User).deleteById(id);

      return {
        status: 200,
        error: undefined,
        data: { massage: `${user} is successfully removed.` },
      };
    }

    return {
      status: 403,
      error: "Access denied. admin validation failed.",
      data: undefined,
    };
  }
}

module.exports = UserController;
