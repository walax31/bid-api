'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const { v4: uuidv4 } = require('uuid')

class Product extends Model {
  static boot () {
    super.boot()

    this.addHook('beforeCreate', async productInstance => {
      productInstance.uuid = uuidv4()
    })
    this.addHook('beforeSave', async productInstance => {
      if (productInstance.dirty.end_date) {
        productInstance.end_date = new Date(productInstance.dirty.end_date)
      }
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

  productDetail () {
    return this.hasOne('App/Models/ProductDetail', 'uuid', 'uuid')
  }

  bids () {
    return this.hasMany('App/Models/Bid', 'uuid', 'product_uuid')
  }

  order () {
    return this.hasOne('App/Models/Order', 'uuid', 'product_uuid')
  }

  credentialRating () {
    return this.hasOne('App/Models/CredentialRating', 'uuid', 'product_uuid')
  }

  tags () {
    return this.belongsToMany(
      'App/Models/Tag',
      'product_uuid',
      'tag_uuid',
      'uuid',
      'uuid'
    ).pivotModel('App/Models/ProductTag')
  }

  specifications () {
    return this.belongsToMany(
      'App/Models/Specification',
      'product_uuid',
      'specification_uuid',
      'uuid',
      'uuid'
    ).pivotModel('App/Models/ProductSpecification')
  }
}

module.exports = Product
