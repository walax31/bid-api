module.exports = function autogenOrderInstance (
  OrderModel,
  customer_uuid,
  product_uuid,
  bid_uuid
) {
  return OrderModel.create({
    customer_uuid,
    product_uuid,
    order_quantity: 10,
    bid_uuid
  }).then(response => response.toJSON())
}
