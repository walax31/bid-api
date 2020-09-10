module.exports = function (OrderModel, customer_id) {
  return OrderModel.create({ customer_id }).then(
    (response) => response["$attributes"]
  );
};
