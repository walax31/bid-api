module.exports = function (row, Factory) {
  return Factory.model("App/Models/ProductDetail").makeMany(row);
};
