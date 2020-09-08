"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class OrderDetailSchema extends Schema {
  up() {
    this.create("order_details", (table) => {
      table.increments("order_detail_id");
      table.timestamps();
      table.integer("product_id").unsigned().notNullable();
      table.integer("order_quantity").unsigned().notNullable();
      table.integer("order_id").unsigned().notNullable();

      table
        .foreign("product_id")
        .references("products.product_id")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");

      table
        .foreign("order_id")
        .references("orders.order_id")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    });
  }

  down() {
    this.drop("order_details");
  }
}

module.exports = OrderDetailSchema;
