'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const { v4: uuidv4 } = require('uuid')

class Specification extends Model {
  static boot () {
    super.boot()

    this.addHook('beforeCreate', async specificationInstance => {
      specificationInstance.uuid = uuidv4()
    })
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

  products () {
    return this.belongsToMany(
      'App/Models/Product',
      'specification_uuid',
      'product_uuid',
      'uuid',
      'uuid'
    ).pivotModel('App/Models/ProductSpecification')
  }
}

module.exports = Specification
