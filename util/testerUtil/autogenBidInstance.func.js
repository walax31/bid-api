module.exports = function (BidModels, customer_uuid, product_uuid) {
  return BidModels.create({
    customer_uuid,
    bid_amount: 1000,
    product_uuid,
  }).then((response) => response.toJSON());
};
