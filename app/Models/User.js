'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

const Encryption = use('Encryption')
const { v4: uuidv4 } = require('uuid')

class User extends Model {
  static boot () {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async userInstance => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.dirty.password)
      }

      if (userInstance.dirty.email) {
        userInstance.email = await Encryption.encrypt(userInstance.dirty.email)
      }
    })

    this.addHook('beforeCreate', async userInstance => {
      userInstance.uuid = uuidv4()
    })
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  static get incrementing () {
    return false
  }

  static get hidden () {
    return ['password', 'email']
  }

  static get primaryKey () {
    return 'uuid'
  }

  customer () {
    return this.hasOne('App/Models/Customer', 'uuid', 'user_uuid')
  }

  alerts () {
    return this.hasMany('App/Models/Alert', 'uuid', 'user_uuid')
  }

  tokens () {
    return this.hasMany('App/Models/Token', 'uuid', 'user_uuid')
  }
}

module.exports = User
