'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductSpecificationSchema extends Schema {
  up () {
    this.create('product_specifications', table => {
      table.uuid('uuid').unique()
      table.uuid('product_uuid').notNullable()
      table.uuid('specification_uuid').notNullable()

      table
        .foreign('product_uuid')
        .references('products.uuid')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')

      table
        .foreign('specification_uuid')
        .references('specifications.uuid')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
    })
  }

  down () {
    this.drop('product_specifications')
  }
}

module.exports = ProductSpecificationSchema
