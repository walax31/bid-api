"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class CustomerSchema extends Schema {
  up() {
    this.create("customers", (table) => {
      table.increments("customer_id");
      table.timestamps();
      table.integer("user_id").unsigned().notNullable();
      table.string("first_name", 50).notNullable();
      table.string("last_name", 50).notNullable();
      table.string("address", 50).notNullable();
      table.string("phone", 20).notNullable().unique();
      table.string("path_to_credential").unique();
      table.boolean("is_validated").notNullable().default(false);

      table
        .foreign("user_id")
        .references("users.user_id")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    });
  }

  down() {
    this.drop("customers");
  }
}

module.exports = CustomerSchema;
