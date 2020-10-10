"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class CronjobSchema extends Schema {
  up() {
    this.create("cronjobs", (table) => {
      table.uuid("uuid").unique();
      table.string("job_title").notNullable();
      table.boolean("job_active").notNullable().default(true);
      table.string("content");
      table.timestamps();
    });
  }

  down() {
    this.drop("cronjobs");
  }
}

module.exports = CronjobSchema;
