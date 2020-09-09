module.exports = function (row, Factory) {
  return Factory.model("App/Models/CredentialRating").makeMany(row);
};
