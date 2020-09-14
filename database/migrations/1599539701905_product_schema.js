"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ProductSchema extends Schema {
  up() {
    this.create("products", (table) => {
      table.increments("product_id");
      table.timestamps();
      table.integer("customer_id").unsigned().notNullable();
      table.string("product_name").notNullable();
      table.time("end_date").notNullable().default(this.fn.now());
      table.integer("stock").notNullable().unsigned();
      table.boolean("is_bidable").notNullable().default(false);
      table.string("product_image").unique();

      table
        .foreign("customer_id")
        .references("customers.customer_id")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    });
  }

  down() {
    this.drop("products");
  }
}

module.exports = ProductSchema;
