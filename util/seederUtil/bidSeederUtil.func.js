module.exports = function (row, Factory, callBack) {
  return Factory.model("App/Models/Bid").makeMany(row, {
    customer_id: callBack,
  });
};
