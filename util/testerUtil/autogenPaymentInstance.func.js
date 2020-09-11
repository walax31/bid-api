module.exports = function (PaymentModel, order_id) {
    return PaymentModel.create({
        method:"pay",
        total:20,
        order_id

    }).then((response) => response["$attributes"]);
  };
  