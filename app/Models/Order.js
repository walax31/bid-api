"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Order extends Model {
  static get primaryKey() {
    return "order_id";
  }
  
  product() {
    return this.belongsTo("App/Models/Product");
  }

  customer() {
    return this.belongsTo("App/Models/Customer");
  }

  orderDetails() {
    return this.hasMany("App/Models/OrderDetail");
  }

  payment() {
    return this.hasOne("App/Models/Payment");
  }
}

module.exports = Order;
