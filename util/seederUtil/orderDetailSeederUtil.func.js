module.exports = function (row, Factory, callback) {
  return Factory.model("App/Models/OrderDetail").makeMany(row, {
    product_id: callback,
  });
};
