module.exports = function makePaymentUtil (PaymentModel) {
  const withReferences = references => {
    const Payment = PaymentModel.query()

    if (references) {
      const extractedReferences = references.split(',')

      extractedReferences.forEach(reference => Payment.with(reference))
    }

    return Payment
  }

  return {
    getAll: (references, page = 1, per_page = 10, customer_uuid) => {
      if (customer_uuid) {
        return withReferences(references)
          .with('order', builder => builder.where({ customer_uuid }))
          .paginate(page, per_page)
      }

      return withReferences(references).paginate(page, per_page)
    },
    getById: (uuid, references) =>
      withReferences(references)
        .where({ uuid })
        .fetch()
        .then(response => response.first()),
    create: async (attributes, references) => {
      const { uuid } = await PaymentModel.create(attributes)

      return withReferences(references)
        .where({ uuid })
        .fetch()
        .then(response => response.first())
    },
    updateById: async (uuid, attributes, references) => {
      const payment = await PaymentModel.find(uuid)

      payment.merge(attributes)

      await payment.save()

      return withReferences(references)
        .where({ uuid })
        .fetch()
        .then(response => response.first())
    },
    deleteById: uuid =>
      PaymentModel.find(uuid).then(response => response.delete()),
    findExistingPayment: uuid =>
      PaymentModel.query()
        .with('order', builder => {
          builder.where({ uuid })
        })
        .fetch()
        .then(response => response.first())
  }
}
