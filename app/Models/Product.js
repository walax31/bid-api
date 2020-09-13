"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Product extends Model {
  static get primaryKey() {
    return "product_id";
  }

  customer() {
    return this.belongsTo("App/Models/Customer");
  }

  productDetail() {
    return this.hasOne("App/Models/ProductDetail");
  }

  bids() {
    return this.hasMany("App/Models/Bid");
  }

  order() {
    return this.hasOne("App/Models/Order");
  }

  credentialRating() {
    return this.hasOne("App/Models/CredentialRating");
  }
}

module.exports = Product;
