"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class BidSchema extends Schema {
  up() {
    this.create("bids", (table) => {
      table.increments("bid_id");
      table.timestamps();
      table.integer("customer_id").unsigned().notNullable();
      table.integer("bid_amount").unsigned().notNullable();
      table.integer("product_id").unsigned().notNullable();

      table
        .foreign("customer_id")
        .references("customers.customer_id")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");

      table
        .foreign("product_id")
        .references("products.product_id")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    });
  }

  down() {
    this.drop("bids");
  }
}

module.exports = BidSchema;
