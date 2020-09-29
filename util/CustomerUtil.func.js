module.exports = function (CustomerModel) {
  const _withReferences = (references) => {
    const _Customer = CustomerModel.query();

    if (references) {
      const extractedReferences = references.split(",");

      extractedReferences.forEach((reference) => _Customer.with(reference));
    }

    return _Customer;
  };

  return {
    getAll: (references, page = 1, per_page = 10) => {
      return _withReferences(references).paginate(page, per_page);
    },
    getById: (uuid, references) => {
      return _withReferences(references)
        .where({ uuid })
        .fetch()
        .then((response) => response.first());
    },
    create: async (attributes, references) => {
      const { uuid } = await CustomerModel.create(attributes);

      return _withReferences(references)
        .where({ uuid })
        .fetch()
        .then((response) => response.first());
    },
    updateById: async (uuid, attributes, references) => {
      const customer = await CustomerModel.find(uuid);

      customer.merge(attributes);

      await customer.save();

      return _withReferences(references)
        .where({ uuid })
        .fetch()
        .then((response) => response.first());
    },
    deleteById: async (uuid) => {
      const customer = await CustomerModel.find(uuid);

      return customer.delete();
    },
    validateUserCredential: async (uuid, references) => {
      const customer = await CustomerModel.find(uuid);

      customer.merge({ is_validated: true });

      await customer.save();

      return _withReferences(references)
        .where({ uuid })
        .fetch()
        .then((response) => response.first());
    },
    hasCredentialValidated: (uuid) => {
      return CustomerModel.query()
        .where({ uuid, is_validated: true })
        .fetch()
        .then((response) => response.first());
    },
    ratingDoBelongToCustomer: (uuid, credential_rating_id) => {
      return CustomerModel.query()
        .with("credentialRating", (builder) =>
          builder.where({ credential_rating_id })
        )
        .where({ uuid })
        .fetch()
        .then((response) => response.first());
    },
    findExistingOrder: (uuid, product_uuid) => {
      return CustomerModel.query()
        .with("orders", (builder) => {
          builder.where({ uuid: product_uuid });
        })
        .where({ uuid })
        .fetch()
        .then((response) => response.first().getRelated("orders").first());
    },
    findProductOnAuthUser: (uuid, product_uuid) => {
      return CustomerModel.query()
        .with("products", (builder) => {
          builder.where({ uuid: product_uuid });
        })
        .where({ uuid })
        .fetch()
        .then((response) => response.first().getRelated("products").first());
    },
    findBidOnThisCustomer: (uuid, bid_uuid) => {
      return CustomerModel.query()
        .with("bids", (builder) => builder.where({ uuid: bid_uuid }))
        .where({ uuid })
        .fetch()
        .then((response) => response.first().getRelated("bids").first());
    },
  };
};
