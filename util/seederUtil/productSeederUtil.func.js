module.exports = function (row, Factory) {
  return Factory.model("App/Models/Product").makeMany(row);
};
