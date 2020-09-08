"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const Hash = use("Hash");

class LoginDetail extends Model {
  static boot() {
    super.boot();

    this.addHook("beforeSave", async (loginDetailInstance) => {
      if (loginDetailInstance.dirty.password) {
        loginDetailInstance.password = await Hash.make(
          loginDetailInstance.dirty.password
        );
      }
    });
  }

  static get primaryKey() {
    return "customer_id";
  }

  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }

  customer() {
    return this.hasOne("App/Models/Customer");
  }

  credential() {
    return this.hasOne("App/Models/Credential");
  }
}

module.exports = LoginDetail;
