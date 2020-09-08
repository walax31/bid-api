"use strict";

const Database = use(`Database`);

const User = use("App/Models/User");
const makeUserUtil = require("../../../util/UserUtil.func");

function numberTypeParamValidator(number) {
  if (Number.isNaN(parseInt(number))) {
    return {
      error: `param:${number} is not supported,please use number type param intnstead`,
    };
  }
  return {};
}
class UserController {
  async index({ request }) {
    const { references = undefined } = request.qs;
    const user = await makeUserUtil(User).getAll(references);

    return { status: 200, error: undefined, data: User };
  }

  async show({ request }) {
    const { id } = request.params;
    const { references } = request.qs;
    const validateValue = numberTypeParamValidator(id);
    if (validateValue.error)
      return { status: 500, error: validateValue.error, date: undefined };
    const user = await makeUserUtil(User).getAll(references);
    return { status: 200, error: undefined, data: User || {} };
  }

  async store({ request }) {
    const { username, email, password } = request.body;

    const rules = {
      email: "required",
      password: "required",
      username: "required",
    };
    const user = await makeUserUtil(User).create(
      { username, email, password },
      rules
    );
    return {
      status: 200,
      error: undefined,
      data: username,
      email,
      password,
    };
  }
  async update({ request }) {
    const { body, params } = request;
    const { id } = params;
    const { username } = body;
    const { email } = body;
    const { password } = body;

    const UserID = await Database.table("users")
      .where({ customer_id: id })
      .update(username, email, password);
    const user = await Database.table("users")
      .where({ user_id: UserID })
      .first();

    return { status: 200, error: undefined, data: user };
  }
  async destroy({ request }) {
    const { id } = request.params;
    await Database.table("users").where({ user_id: id }).delete();

    return { status: 200, error: undefined, data: { massage: "success" } };
  }
}

module.exports = UserController;
