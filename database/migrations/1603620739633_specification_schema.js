'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SpecificationSchema extends Schema {
  up () {
    this.create('specifications', table => {
      table.uuid('uuid').unique()
      table.string('type').notNullable()
      table.string('name').notNullable().unique()
    })
  }

  down () {
    this.drop('specifications')
  }
}

module.exports = SpecificationSchema
