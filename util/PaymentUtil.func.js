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
    getAll: (references, page = 1, per_page = 10, customer_uuid) => {
      if (customer_uuid)
        return _withReferences(references)
          .with("order", (builder) => builder.where({ customer_uuid }))
          .paginate(page, per_page);

      return _withReferences(references).paginate(page, per_page);
    },
    getById: (uuid, references) => {
      return _withReferences(references)
        .where({ uuid })
        .fetch()
        .then((response) => response.first());
    },
    create: async (attributes, references) => {
      const { uuid } = await PaymentModel.create(attributes);

      return _withReferences(references)
        .where({ uuid })
        .fetch()
        .then((response) => response.first());
    },
    updateById: async (uuid, attributes, references) => {
      let payment = await PaymentModel.find(uuid);

      payment.merge(attributes);

      await payment.save();

      return _withReferences(references)
        .where({ uuid })
        .fetch()
        .then((response) => response.first());
    },
    deleteById: async (uuid) => {
      const payment = await PaymentModel.find(uuid);

      return payment.delete();
    },
    findExistingPayment: (uuid) => {
      return PaymentModel.query()
        .with("order", (builder) => {
          builder.where({ uuid });
        })
        .fetch()
        .then((response) => response.first());
    },
  };
};
