module.exports = function (ProductModel, customer_uuid, is_biddable = true) {
  return ProductModel.create({
    customer_uuid,
    product_name: "product_name",
    // end_date: new Date(),
    stock: 10,
    is_biddable,
  }).then((response) => response.toJSON());
};
