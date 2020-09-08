"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class PaymentSchema extends Schema {
  up() {
    this.create("payments", (table) => {
      table.increments("order_id");
      table.timestamps();
      table.string("method").notNullable();
      table.string("status").notNullable().default("pending");
      table.integer("total").unsigned().notNullable();

      table
        .foreign("order_id")
        .references("orders.order_id")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    });
  }

  down() {
    this.drop("payments");
  }
}

module.exports = PaymentSchema;
