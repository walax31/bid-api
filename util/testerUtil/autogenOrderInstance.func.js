module.exports = function (OrderModel, customer_uuid, product_uuid) {
  return OrderModel.create({
    customer_uuid,
    product_uuid,
    order_quantity: 10,
  }).then((response) => response.toJSON());
};
