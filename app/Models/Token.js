"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Token extends Model {
  static get primaryKey() {
    return "token_id";
  }

  user() {
    return this.belongsTo("App/Models/User");
  }
}

module.exports = Token;
