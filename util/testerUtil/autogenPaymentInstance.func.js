module.exports = function (PaymentModel, uuid) {
  return PaymentModel.create({
    method: "promptpay",
    total: 20,
    uuid,
  }).then((response) => response.toJSON());
};

