"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const { v4: uuidv4 } = require("uuid");

class CronJob extends Model {
  static boot() {
    super.boot();

    this.addHook("beforeCreate", async (cronInstance) => {
      cronInstance.uuid = uuidv4();
    });
  }

  static get table() {
    return "cronjobs";
  }

  static get incrementing() {
    return false;
  }

  static get primaryKey() {
    return "uuid";
  }
}

module.exports = CronJob;
