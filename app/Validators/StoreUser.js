"use strict";

class StoreUser {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      // validation rules
      username: "required|unique:users,username",
      email: "required|unique:users,email|email",
      password: "required|min:8",
    };
  }

  get messages() {
    return {
      "username.required": "You must provide an username.",
      "username.unique": "You provide an unique username.",
      "email.required": "You must provide an email address.",
      "email.unique": "You must provide an unique email address.",
      "email.email": "You must provide a valid email address.",
      "password.required": "You must provide a password.",
    };
  }
}

module.exports = StoreUser;
