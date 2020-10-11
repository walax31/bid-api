'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CustomerSchema extends Schema {
  up () {
    this.create('customers', table => {
      table.uuid('uuid').unique()
      table.string('first_name', 50).notNullable()
      table.string('last_name', 50).notNullable()
      table.string('path_to_credential').unique()
      table.boolean('is_validated').notNullable().default(false)
      table.boolean('is_rejected').notNullable().default(false)
      table.uuid('user_uuid').notNullable()
      table.timestamps()

      table
        .foreign('user_uuid')
        .references('users.uuid')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
    })
  }

  down () {
    this.drop('customers')
  }
}

module.exports = CustomerSchema
