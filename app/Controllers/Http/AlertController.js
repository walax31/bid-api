"use strict";

const Alert = use("App/Models/Alert");
const makeAlertUtil = require("../../../util/alertUtil.func");

class AlertController {
  async index({ request }) {
    const { references = "", page, per_page } = request.qs;

    const { rows, pages } = await makeAlertUtil(Alert).getAll(
      request.user_uuid,
      references,
      page,
      per_page
    );

    return {
      status: 200,
      error: undefined,
      pages,
      data: rows,
    };
  }

  async show({ request }) {
    const { params, qs, user_uuid } = request;

    const { id } = params;

    const { references } = qs;

    const alert = await makeAlertUtil(Alert).getById(id, user_uuid, references);

    return {
      status: 200,
      error: undefined,
      data: alert || {},
    };
  }

  async store() {
    return {
      status: 403,
      error: "Access denied. alert cannot be created directly.",
      data: undefined,
    };
  }

  async update() {
    return {
      status: 403,
      error: "Access denied. alert cannot be updated directly.",
      data: undefined,
    };
  }

  async delete() {
    return {
      status: 403,
      error: "Access denied. alert cannot be deleted directly.",
      data: undefined,
    };
  }
}

module.exports = AlertController;
