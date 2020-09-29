"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class ProductDetail extends Model {
  static get incrementing() {
    return false;
  }

  static get primaryKey() {
    return "uuid";
  }

  product() {
    return this.belongsTo("App/Models/Product", "uuid", "uuid");
  }
}

module.exports = ProductDetail;
