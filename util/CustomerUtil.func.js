module.exports = function makeCustomerUtil (CustomerModel) {
  const withReferences = references => {
    const Customer = CustomerModel.query()

    if (references) {
      const extractedReferences = references.split(',')

      extractedReferences.forEach(reference => Customer.with(reference))
    }

    return Customer
  }

  return {
    getAll: (references, page = 1, per_page = 10) =>
      withReferences(references).paginate(page, per_page),
    getById: (uuid, references) =>
      withReferences(references)
        .where({ uuid })
        .fetch()
        .then(response => response.first()),
    create: async (attributes, references) => {
      const { uuid } = await CustomerModel.create(attributes)

      return withReferences(references)
        .where({ uuid })
        .fetch()
        .then(response => response.first())
    },
    updateById: async (uuid, attributes, references) => {
      const customer = await CustomerModel.find(uuid)

      customer.merge(attributes)

      await customer.save()

      return withReferences(references)
        .where({ uuid })
        .fetch()
        .then(response => response.first())
    },
    deleteById: uuid =>
      CustomerModel.find(uuid).then(response => response.delete()),
    validateUserCredential: async (uuid, references) => {
      const customer = await CustomerModel.find(uuid)

      customer.merge({ is_validated: true })

      await customer.save()

      return withReferences(references)
        .where({ uuid })
        .fetch()
        .then(response => response.first())
    },
    hasCredentialValidated: uuid =>
      CustomerModel.query()
        .where({ uuid, is_validated: true })
        .fetch()
        .then(response => response.first()),
    ratingDoBelongToCustomer: (uuid, credential_rating_id) =>
      CustomerModel.query()
        .with('credentialRating', builder =>
          builder.where({ credential_rating_id }))
        .where({ uuid })
        .fetch()
        .then(response => response.first()),
    findExistingOrder: (uuid, product_uuid) =>
      CustomerModel.query()
        .with('orders', builder => {
          builder.where({ uuid: product_uuid })
        })
        .where({ uuid })
        .fetch()
        .then(response => response.first().getRelated('orders').first()),
    findProductOnAuthUser: (uuid, product_uuid) =>
      CustomerModel.query()
        .with('products', builder => {
          builder.where({ uuid: product_uuid })
        })
        .where({ uuid })
        .fetch()
        .then(response => response.first().getRelated('products').first()),
    bidBelongToCustomer: (uuid, bid_uuid) =>
      CustomerModel.query()
        .with('bids', builder => builder.where({ uuid: bid_uuid }))
        .where({ uuid })
        .fetch()
        .then(response => response.first().getRelated('bids').first()),
    credentialBelongToCustomer: (uuid, path_to_credential) =>
      CustomerModel.query()
        .where({ uuid, path_to_credential })
        .fetch()
        .then(response => response.first())
  }
}
