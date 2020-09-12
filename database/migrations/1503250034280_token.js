"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class TokensSchema extends Schema {
  up() {
    this.create("tokens", (table) => {
      table.increments("token_id");
      table.integer("user_id").unsigned();
      table.string("token", 255).notNullable().unique().index();
      table.string("type", 80).notNullable();
      table.boolean("is_revoked").defaultTo(false);
      table.timestamps();

      table
        .foreign("user_id")
        .references("users.user_id")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    });
  }

  down() {
    this.drop("tokens");
  }
}

module.exports = TokensSchema;
