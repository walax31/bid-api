module.exports = function (row, Factory) {
  return Factory.model("App/Models/Customer").makeMany(row);
};
