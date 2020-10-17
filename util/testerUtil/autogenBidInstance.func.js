module.exports = function(
  BidModels,
  customer_uuid,
  product_uuid,
  bid_amount = 1000
) {
  return BidModels.create({
    customer_uuid,
    bid_amount,
    product_uuid
  }).then(response => response.toJSON())
}
