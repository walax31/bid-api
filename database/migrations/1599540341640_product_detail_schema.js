"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ProductDetailSchema extends Schema {
  up() {
    this.create("product_details", (table) => {
      table.increments("product_id");
      table.timestamps();
      table.integer("product_price").notNullable().unsigned();
      table.integer("product_bid_start").notNullable().unsigned();
      table.integer("product_bid_increment").notNullable().unsigned();
      table.string("product_description").notNullable();

      table
        .foreign("product_id")
        .references("products.product_id")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    });
  }

  down() {
    this.drop("product_details");
  }
}

module.exports = ProductDetailSchema;
