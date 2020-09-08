"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class ProductDetail extends Model {
  static get primaryKey() {
    return "product_id";
  }

  product() {
    return this.belongsTo("App/Models/Product");
  }
}

module.exports = ProductDetail;
