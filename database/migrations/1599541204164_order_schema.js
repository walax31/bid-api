'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class OrderSchema extends Schema {
  up () {
    this.create('orders', table => {
      table.uuid('uuid').unique()
      table.uuid('product_uuid').notNullable()
      table.integer('order_quantity').unsigned().notNullable()
      table.uuid('customer_uuid').notNullable()
      table.uuid('bid_uuid').notNullable()
      table.timestamps()

      table
        .foreign('customer_uuid')
        .references('customers.uuid')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      table
        .foreign('bid_uuid')
        .references('bids.uuid')
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
    this.drop('orders')
  }
}

module.exports = OrderSchema
