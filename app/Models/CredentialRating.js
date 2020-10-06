"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const { v4: uuidv4 } = require("uuid");

class CredentialRating extends Model {
  static boot() {
    super.boot();

    this.addHook("beforeCreate", async (ratingInstance) => {
      ratingInstance.uuid = uuidv4();
    });
  }

  static get incrementing() {
    return false;
  }

  static get primaryKey() {
    return "uuid";
  }

  customer() {
    return this.belongsTo("App/Models/Customer", "customer_uuid", "uuid");
  }

  product() {
    return this.belongsTo("App/Models/Product", "product_uuid", "uuid");
  }
}

module.exports = CredentialRating;
