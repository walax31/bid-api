module.exports = function (PaymentModel) {
  const _withReferences = (references) => {
    const _Payment = PaymentModel.query();

    if (references) {
      const extractedReferences = references.split(",");

      extractedReferences.forEach((reference) => _Payment.with(reference));
    }

    return _Payment;
  };

  return {
    getAll: (references) => {
      return _withReferences(references).fetch();
    },
    getById: (order_id, references) => {
      return _withReferences(references)
        .where({ order_id })
        .fetch()
        .then((response) => response.first());
    },
    create: async (attributes, references) => {
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
