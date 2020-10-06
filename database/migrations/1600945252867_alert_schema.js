"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AlertSchema extends Schema {
  up() {
    this.create("alerts", (table) => {
      table.uuid("uuid").unique();
      table.time("expiration_date").notNullable().default(this.fn.now());
      table.boolean("is_expired").notNullable().default(false);
      table.boolean("is_proceeded").notNullable().default(false);
      table.boolean("is_cancelled").notNullable().default(false);
      table.uuid("user_uuid").notNullable();
      table.timestamps();

      table
        .foreign("user_uuid")
        .references("users.uuid")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
    });
  }

  down() {
    this.drop("alerts");
  }
}

module.exports = AlertSchema;
