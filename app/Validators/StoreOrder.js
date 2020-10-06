"use strict";

class StoreOrder {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      // validation rules
      customer_uuid: "required",
      product_uuid: "required",
      order_quantity: "required",
    };
  }

  get messages() {
    return {
      "customer_uuid.required": "You must provide the customer_uuid.",
      "product_uuid.required": "You must provide uuid of the profuct you own.",
      "order_quantity.required": "You must provide the quantity of an order.",
    };
  }
}

module.exports = StoreOrder;
