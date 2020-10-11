'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const { v4: uuidv4 } = require('uuid')

class Order extends Model {
  static boot () {
    super.boot()

    this.addHook('beforeCreate', async orderInstance => {
      orderInstance.uuid = uuidv4()
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

  product () {
    return this.belongsTo('App/Models/Product', 'product_uuid', 'uuid')
  }

  customer () {
    return this.belongsTo('App/Models/Customer', 'customer_uuid', 'uuid')
  }

  payment () {
    return this.hasOne('App/Models/Payment', 'uuid', 'uuid')
  }
}

module.exports = Order
