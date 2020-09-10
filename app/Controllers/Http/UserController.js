"use strict";
const userValidator = require("../../../service/userValidator");
const User = use("App/Models/User");
const makeUserUtil = require("../../../util/UserUtil.func");
const numberTypeParamValidator = require("../../../util/numberTypeParamValidator.func");

class UserController {
  async login({ auth, request }) {
    const { username, password } = request.all();

    return {
      status: 200,
      error: undefined,
      data: await auth.withRefreshToken().attempt(username, password),
    };
  }

  async authenticate({ auth, request }) {
    const refreshToken = request.input("refresh_token");

    try {
      await auth.check();

      return {
        status: 200,
        error: undefined,
        // data: await auth
        //   .newRefreshToken()
        //   .generateForRefreshToken(refreshToken),
      };
    } catch (error) {
      return {
        status: 503,
        error: "missing auth token",
        data: undefined,
      };
    }
  }

  async logout({ auth }) {
    // const
  }

  async index({ request }) {
    const { references } = request.qs;

    const users = await makeUserUtil(User).getAll(references);

    return { status: 200, error: undefined, data: users };
  }

  async show({ request }) {
    const { params, qs } = request;

    const { id } = params;

    const { references } = qs;

    const validateValue = numberTypeParamValidator(id);

    if (validateValue.error)
      return { status: 500, error: validateValue.error, date: undefined };

    const user = await makeUserUtil(User).getById(id, references);

    return { status: 200, error: undefined, data: user || {} };
  }

  async store({ request }) {
    const { body, qs } = request;

    const { username, email, password } = body;

    const { references } = qs;

    const validation = await userValidator(request.body);

    if (validation.error) {
      return { status: 422, error: validation.error, data: undefined };
    }
    const user = await makeUserUtil(User).create(
      {
        username,
        email,
        password,
      },
      references
    );

    return {
      status: 200,
      error: undefined,
      data: user,
    };
  }
  async update({ request }) {
    const { body, params, qs } = request;

    const { id } = params;

    const { references } = qs;

    const { username, email, password } = body;

    const User = await makeUserUtil(User).updateById(
      id,
      { username, email, password },
      references
    );

    return { status: 200, error: undefined, data: user };
  }
  async destroy({ request }) {
    const { id } = request.params;

    const user = await makeUserUtil(User).deleteById(id);

    return {
      status: 200,
      error: undefined,
      data: { massage: `${user} is successfully removed.` },
    };
  }
}

module.exports = UserController;
