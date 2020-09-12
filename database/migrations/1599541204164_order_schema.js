"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class OrderSchema extends Schema {
  up() {
    this.create("orders", (table) => {
      table.increments("order_id");
      table.timestamps();
      table.integer("product_id").unsigned().notNullable();
      table.integer("order_quantity").unsigned().notNullable();
      table.integer("customer_id").unsigned().notNullable();
      table.integer("product_id").unsigned().notNullable();
      table.integer("order_quantity").unsigned().notNullable();
     

      table
        .foreign("product_id")
        .references("products.product_id")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");


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
    this.drop("orders");
  }
}

module.exports = OrderSchema;
