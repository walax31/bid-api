"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class CredentialRatingSchema extends Schema {
  up() {
    this.create("credential_ratings", (table) => {
      table.increments("credential_rating_id");
      table.timestamps();
      table.integer("customer_id").notNullable().unsigned();
      table.integer("rating_score").notNullable();
      table.string("rating_description").notNullable();
      table.integer("product_id").notNullable().unsigned();

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
    this.drop("credential_ratings");
  }
}

module.exports = CredentialRatingSchema;
