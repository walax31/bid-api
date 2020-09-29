module.exports = function (ProductDetailModel, uuid) {
  return ProductDetailModel.create({
    uuid,
    product_price: 200,
    product_bid_start: 10,
    product_bid_increment: 50,
    product_description: "dfsffs",
  }).then((response) => response.toJSON());
};
