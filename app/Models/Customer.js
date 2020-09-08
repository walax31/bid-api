"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Customer extends Model {
  static get primaryKey() {
    return "customer_id";
  }

  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }

  user() {
    return this.belongsTo("App/Models/User");
  }
  // loginDetail() {
  //   return this.belongsTo("App/Models/LoginDetail");
  // }

  credentialRatings() {
    return this.hasMany("App/Models/CredentialRating");
  }

  products() {
    return this.hasMany("App/Models/Product");
  }

  bids() {
    return this.hasMany("App/Models/Bid");
  }

  orders() {
    return this.hasMany("App/Models/Order");
  }

  payments() {
    return this.hasMany("App/Models/Payment");
  }
}

module.exports = Customer;
