'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const { v4: uuidv4 } = require('uuid')

class Tag extends Model {
  static boot () {
    super.boot()

    this.addHook('beforeCreate', async tagInstance => {
      tagInstance.uuid = uuidv4()
    })
  }

  static get primaryKey () {
    return 'uuid'
  }

  static get incrementing () {
    return false
  }

  static get updatedAtColumn () {
    return null
  }

  static get createdAtColumn () {
    return null
  }

  products () {
    return this.belongsToMany(
      'App/Models/Product',
      'tag_uuid',
      'product_uuid',
      'uuid',
      'uuid'
    ).pivotTable('product_tags')
  }
}

module.exports = Tag
