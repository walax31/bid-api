module.exports = function (ProductDetailModel, product_id) {
    return ProductDetailModel.create({
        product_id,
        product_price:200,
        product_bid_start:10,
        product_bid_increment:50,
        product_description:"dfsffs"
    }).then((response) => response["$attributes"]);
  };
  