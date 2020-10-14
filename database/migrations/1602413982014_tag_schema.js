'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TagSchema extends Schema {
  up () {
    this.create('tags', table => {
      table.uuid('uuid').unique()
      table.string('tag_name').unique()
    })
  }

  down () {
    this.drop('tags')
  }
}

module.exports = TagSchema
