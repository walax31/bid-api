"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class LoginDetailSchema extends Schema {
  up() {
    this.create("login_details", (table) => {
      table.increments("customer_id");
      table.string("login_username", 20).unique().notNullable();
      table.string("login_email").unique().notNullable();
      table.string("login_password").notNullable();
    });
  }

  down() {
    this.drop("login_details");
  }
}

module.exports = LoginDetailSchema;
