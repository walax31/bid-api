"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class CredentialRating extends Model {
  static get primaryKey() {
    return "credential_rating_id";
  }

  customer() {
    return this.belongsTo("App/Models/Customer");
  }
}

module.exports = CredentialRating;
