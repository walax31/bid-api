module.exports = function (row, Factory) {
  return Factory.model("App/Models/User").createMany(row);
};
