module.exports = function (row, Factory) {
  return Factory.model("App/Models/Payment").makeMany(row);
};
