"use strict";

class StoreAlert {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      // validation rules
      user_uuid: "required",
    };
  }

  get messages() {
    return { "user_uuid.required": "You must provide a user_uuid." };
  }
}

module.exports = StoreAlert;
