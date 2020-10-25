'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const { v4: uuidv4 } = require('uuid')

class ProductTag extends Model {
  static boot () {
    super.boot()

    this.addHook('beforeCreate', async productTagInstance => {
      productTagInstance.uuid = uuidv4()
    })
  }

  static get table () {
    return 'product_tags'
  }

  static get incrementing () {
    return false
  }

  static get primaryKey () {
    return 'uuid'
  }

  static get updatedAtColumn () {
    return null
  }

  static get createdAtColumn () {
    return null
  }
}

module.exports = ProductTag
