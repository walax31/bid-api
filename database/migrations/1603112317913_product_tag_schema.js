'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductTagSchema extends Schema {
  up () {
    this.create('product_tags', table => {
      table.uuid('uuid').unique()
      table.uuid('tag_uuid')
      table.uuid('product_uuid')

      table
        .foreign('tag_uuid')
        .references('tags.uuid')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')

      table
        .foreign('product_uuid')
        .references('products.uuid')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
    })
  }

  down () {
    this.drop('product_tags')
  }
}

module.exports = ProductTagSchema
