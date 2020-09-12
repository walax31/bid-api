"use strict";

const Env = use("Env");
const Encryption = use("Encryption");
const userValidator = require("../../../service/userValidator");
const User = use("App/Models/User");
const makeUserUtil = require("../../../util/UserUtil.func");
const numberTypeParamValidator = require("../../../util/numberTypeParamValidator.func");
const performAuthentication = require("../../../util/authenticate.func");

class UserController {
  async index({ auth, request }) {
    const { references } = request.qs;

    const { admin, error } = await performAuthentication(auth).validateAdmin();

    if (error)
      return {
        status: 403,
        error,
        data: undefined,
      };

    if (admin) {
      const users = await makeUserUtil(User).getAll(references);

      return { status: 200, error: undefined, data: users };
    }

    return {
      status: 200,
      error: "admin validation failed.",
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
        error,
        data: undefined,
      };

    const validateValue = numberTypeParamValidator(id);

    if (validateValue.error)
      return { status: 500, error: validateValue.error, date: undefined };

    if (admin) {
      const { user_id, username, email } = await makeUserUtil(User).getById(
        id,
        references
      );

      return {
        status: 200,
        error: undefined,
        data:
          { user_id, username, email: await Encryption.decrypt(email) } || {},
      };
    }

    const { auth_id } = await performAuthentication(auth).validateIdParam();

    if (auth_id === parseInt(id)) {
      const { user_id, username, email } = await makeUserUtil(User).getById(
        auth_id,
        references
      );

      return {
        status: 200,
        error: undefined,
        data:
          { user_id, username, email: await Encryption.decrypt(email) } || {},
      };
    }

    return {
      status: 200,
      error: "id param does not match credential id.",
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
        error: "This action is reserved for guest only.",
      };

    const validation = await userValidator(request.body);

    if (validation.error) {
      return { status: 422, error: validation.error, data: undefined };
    }

    const user = await makeUserUtil(User).create(
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

    return {
      status: 200,
      error: undefined,
      data: {
        user_id: user.user_id,
        username: user.username,
        is_admin: user.is_admin == 1 ?? user.is_admin,
      },
      tokens,
    };
  }

  async update({ auth, request }) {
    const { body, params, qs } = request;

    const { id } = params;

    const { references } = qs;

    const { email } = body;

    const { admin } = await performAuthentication(auth).validateAdmin();

    const validateValue = numberTypeParamValidator(id);

    if (validateValue.error)
      return { status: 500, error: validateValue.error, date: undefined };

    if (admin) {
      const user = await makeUserUtil(User).updateById(
        id,
        { email },
        references
      );

      return { status: 200, error: undefined, data: user };
    }

    const { auth_id } = await performAuthentication(auth).validateIdParam();

    if (auth_id === parseInt(id)) {
      const user = await makeUserUtil(User).updateById(
        auth_id,
        { email },
        references
      );

      return { status: 200, error: undefined, data: user };
    }

    return {
      status: 403,
      error: "id param does not match credential id.",
      data: undefined,
    };
  }

  async destroy({ auth, request }) {
    const { id } = request.params;

    const { admin } = await performAuthentication(auth).validateAdmin();

    const validateValue = numberTypeParamValidator(id);

    if (validateValue.error)
      return { status: 500, error: validateValue.error, date: undefined };

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
      error: "admin validation failed.",
      data: undefined,
    };
  }
}

module.exports = UserController;
