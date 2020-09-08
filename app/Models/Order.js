"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Order extends Model {
  static get primaryKey() {
    return "order_id";
  }

  customer() {
    return this.belongsTo("App/Models/Customer");
  }

  orderDetails() {
    return this.hasMany("App/Models/OrderDetail");
  }
}

module.exports = Order;
