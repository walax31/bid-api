module.exports = function (PaymentModel) {
  const _withReferences = (references) => {
    const _Payment = PaymentModel.query();

    if (references) {
      const extractedReferences = references.split(",");

      extractedReferences.forEach((reference) => _Payment.with(reference));
    }

    return _Payment;
  };

  const _findExistingPayment = (customer_id) => {
    return PaymentModel.query()
      .with("order", (builder) => {
        builder.where({ customer_id });
      })
      .fetch()
      .then((response) => response.first());
  };

  const _findExistingOrder = (OrderModel, customer_id) => {
    return OrderModel.query()
      .where({ customer_id })
      .fetch()
      .then((response) => response.first());
  };

  return {
    getAll: (references, customer_id) => {
      if (customer_id)
        return _withReferences(references)
          .with("order", (builder) => builder.where({ customer_id }))
          .fetch();

      return _withReferences(references).fetch();
    },
    getById: (order_id, references) => {
      return _withReferences(references)
        .where({ order_id })
        .fetch()
        .then((response) => response.first());
    },
    create: async (attributes, OrderModel, customer_id, references) => {
      const existingPayment = await _findExistingPayment(customer_id);

      const existingOrder = await _findExistingOrder(OrderModel, customer_id);

      if (existingPayment)
        return {
          status: 500,
          error: "Payment already existed.",
        };

      if (!existingOrder)
        return {
          status: 404,
          error: "You never ordered this product.",
        };

      const { order_id } = await PaymentModel.create(attributes);

      return _withReferences(references)
        .where({ order_id })
        .fetch()
        .then((response) => response.first());
    },
    updateById: async (order_id, attributes, references) => {
      let payment = await PaymentModel.find(order_id);

      payment.merge(attributes);

      await payment.save();

      return _withReferences(references)
        .where({ order_id })
        .fetch()
        .then((response) => response.first());
    },
    deleteById: async (order_id) => {
      const payment = await PaymentModel.find(order_id);

      return payment.delete();
    },
  };
};
