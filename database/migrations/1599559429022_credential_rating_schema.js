"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class CredentialRatingSchema extends Schema {
  up() {
    this.create("credential_ratings", (table) => {
      table.increments("credential_rating_id");
      table.timestamps();
      table.uuid("customer_uuid").notNullable();
      table.integer("rating_score").notNullable();
      table.string("rating_description").notNullable();
      table.uuid("product_uuid").notNullable();

      table
        .foreign("customer_uuid")
        .references("customers.uuid")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");

      table
        .foreign("product_uuid")
        .references("products.uuid")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    });
  }

  down() {
    this.drop("credential_ratings");
  }
}

module.exports = CredentialRatingSchema;
