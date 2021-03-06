'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const { v4: uuidv4 } = require('uuid')

class Address extends Model {
  static boot () {
    super.boot()

    this.addHook('beforeCreate', async addressInstance => {
      addressInstance.uuid = uuidv4()
    })
  }

  static get incrementing () {
    return false
  }

  static get hidden () {
    return []
  }

  static get primaryKey () {
    return 'uuid'
  }

  customer () {
    return this.belongsTo('App/Models/Customer', 'customer_uuid', 'uuid')
  }
}

module.exports = Address
