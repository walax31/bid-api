'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', table => {
      table.uuid('uuid').unique()
      table.string('username', 80).notNullable().unique()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.string('profile_path')
      table.string('description')
      table.boolean('is_admin').notNullable().default(false)
      table.boolean('is_submitted').notNullable().default(false)
      table.boolean('is_banned').notNullable().default(false)
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
