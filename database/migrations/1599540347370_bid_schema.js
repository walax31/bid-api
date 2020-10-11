'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BidSchema extends Schema {
  up () {
    this.create('bids', table => {
      table.uuid('uuid').unique()
      table.integer('bid_amount').unsigned().notNullable()
      table.uuid('customer_uuid').notNullable()
      table.uuid('product_uuid').notNullable()
      table.timestamps()

      table
        .foreign('customer_uuid')
        .references('customers.uuid')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      table
        .foreign('product_uuid')
        .references('products.uuid')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
    })
  }

  down () {
    this.drop('bids')
  }
}

module.exports = BidSchema
