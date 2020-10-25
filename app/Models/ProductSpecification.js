'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const { v4: uuidv4 } = require('uuid')

class ProductSpecification extends Model {
  static boot () {
    super.boot()

    this.addHook('beforeCreate', async productSpecificationInstance => {
      productSpecificationInstance.uuid = uuidv4()
    })
  }

  static get table () {
    return 'product_specifications'
  }

  static get incrementing () {
    return false
  }

  static get primaryKey () {
    return 'uuid'
  }

  static get createdAtColumn () {
    return null
  }

  static get updatedAtColumn () {
    return null
  }
}

module.exports = ProductSpecification
