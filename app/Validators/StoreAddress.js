"use strict";

class StoreAddress {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      // validation rules
      phone: "required|max:20|unique:addresses,phone",
      building: "required",
      city: "required",
      sub_city: "required",
      province: "required",
      postal_code: "required",
      customer_uuid: "required",
    };
  }

  get messages() {
    return {
      "phone.required": "you must provide a phone number.",
      "phone.max":
        "Your provided phone number lengths is over 20 characters long.",
      "phone.unique": "You must provide a unique phone number.",
      "building.required": "You must provide a building address.",
      "city.required": "You must provide a city name.",
      "sub_city.required": "You must provide a sub city name.",
      "province.required": "You must provide a province name.",
      "postal_code.required": "You must provide a postal code.",
      "customer_uuid.required": "You must provide a uuid.",
    };
  }
}

module.exports = StoreAddress;
