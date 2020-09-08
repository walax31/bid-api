module.exports = function (row, Factory, callback) {
  return Factory.model("App/Models/Order").makeMany(row, {
    customer_id: callback,
  });
};
