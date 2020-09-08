"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class CustomerSchema extends Schema {
  up() {
    this.create("customers", (table) => {
      table.increments("customer_id");
      table.timestamps();
      table.string("customer_first_name", 50).notNullable();
      table.string("customer_last_name", 50).notNullable();
      table.string("customer_address", 50).notNullable();
      table.string("customer_phone", 10).notNullable();
      table.string("customer_path_to_credential").notNullable().unique();

      table
        .foreign("customer_id")
        .references("login_details.customer_id")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    });
  }

  down() {
    this.drop("customers");
  }
}

module.exports = CustomerSchema;
