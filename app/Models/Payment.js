"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Payment extends Model {
  static get primaryKey() {
    return "order_id";
  }

  order() {
    return this.belongsTo("App/Models/Order");
  }
}

module.exports = Payment;
