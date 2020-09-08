"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class OrderDetail extends Model {
  static get primaryKey() {
    return "order_detail_id";
  }

  product() {
    return this.belongsTo("App/Models/Product");
  }

  order() {
    return this.belongsTo("App/Models/Order");
  }
}

module.exports = OrderDetail;
