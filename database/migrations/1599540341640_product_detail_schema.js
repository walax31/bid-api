'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductDetailSchema extends Schema {
  up () {
    this.create('product_details', table => {
      table.uuid('uuid').unique()
      table.integer('product_price').notNullable().unsigned()
      table.integer('product_bid_start').notNullable().unsigned()
      table.integer('product_bid_increment').notNullable().unsigned()
      table.string('product_description').notNullable()
      table.timestamps()

      table
        .foreign('uuid')
        .references('products.uuid')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
    })
  }

  down () {
    this.drop('product_details')
  }
}

module.exports = ProductDetailSchema
