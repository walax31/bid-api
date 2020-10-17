'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const { v4: uuidv4 } = require('uuid')

class Bid extends Model {
  static boot () {
    super.boot()

    this.addHook('beforeCreate', async bidInstance => {
      bidInstance.uuid = uuidv4()
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

  product () {
    return this.belongsTo('App/Models/Product', 'product_uuid', 'uuid')
  }

  order () {
    return this.hasOne('App/Models/Order', 'uuid', 'bid_uuid')
  }
}

module.exports = Bid
