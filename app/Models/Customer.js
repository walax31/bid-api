'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const { v4: uuidv4 } = require('uuid')

class Customer extends Model {
  static boot () {
    super.boot()

    this.addHook('beforeCreate', async customerInstance => {
      customerInstance.uuid = uuidv4()
    })
  }

  static get hidden () {
    return []
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

  address () {
    return this.hasOne('App/Models/Address', 'uuid', 'customer_uuid')
  }

  credentialRatings () {
    return this.hasMany('App/Models/CredentialRating', 'uuid', 'customer_uuid')
  }

  products () {
    return this.hasMany('App/Models/Product', 'uuid', 'customer_uuid')
  }

  bids () {
    return this.hasMany('App/Models/Bid', 'uuid', 'customer_uuid')
  }

  orders () {
    return this.hasMany('App/Models/Order', 'uuid', 'customer_uuid')
  }

  payments () {
    return this.hasMany('App/Models/Payment', 'uuid', 'customer_uuid')
  }
}

module.exports = Customer
