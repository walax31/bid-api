'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddressSchema extends Schema {
  up () {
    this.create('addresses', table => {
      table.uuid('uuid').unique()
      table.string('phone', 20).notNullable().unique()
      table.string('building').notNullable()
      table.string('road').notNullable().default('-')
      table.string('city').notNullable()
      table.string('sub_city').notNullable()
      table.string('province').notNullable()
      table.string('postal_code').notNullable()
      table.uuid('customer_uuid').notNullable()
      table.timestamps()

      table
        .foreign('customer_uuid')
        .references('customers.uuid')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
    })
  }

  down () {
    this.drop('addresses')
  }
}

module.exports = AddressSchema
