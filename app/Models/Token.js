'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const { v4: uuidv4 } = require('uuid')

class Token extends Model {
  static boot () {
    super.boot()

    this.addHook('beforeCreate', async tokenInstance => {
      tokenInstance.uuid = uuidv4()
    })
  }

  static get incrementing () {
    return false
  }

  static get primaryKey () {
    return 'uuid'
  }

  user () {
    return this.belongsTo('App/Models/User', 'user_uuid', 'uuid')
  }
}

module.exports = Token
