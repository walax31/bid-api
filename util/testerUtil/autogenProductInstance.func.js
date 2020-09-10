module.exports = function (ProductModel, customer_id) {
  return ProductModel.create({
    customer_id,
    product_name: "product_name",
    end_date: new Date(),
    stock: 10,
  }).then((response) => response["$attributes"]);
};
