'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductSchema extends Schema {
  up () {
    this.create('products', table => {
      table.uuid('uuid').unique()
      table.string('product_name').notNullable()
      table.time('end_date').notNullable().default(this.fn.now())
      table.integer('stock').notNullable().unsigned()
      table.boolean('is_biddable').notNullable().default(false)
      table.string('product_image').unique()
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
    this.drop('products')
  }
}

module.exports = ProductSchema
