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
    getById: (customer_id, references) => {
      return _withReferences(references)
        .where({ customer_id })
        .fetch()
        .then((response) => response.first());
    },
    create: async (attributes, references) => {
      const { customer_id } = await CustomerModel.create(attributes);

      return _withReferences(references)
        .where({ customer_id })
        .fetch()
        .then((response) => response.first());
    },
    updateById: async (customer_id, attributes, references) => {
      let customerDetail = await CustomerModel.find(customer_id);

      customerDetail.merge(attributes);

      await customerDetail.save();

      return _withReferences(references)
        .where({ customer_id })
        .fetch()
        .then((response) => response.first());
    },
    deleteById: async (customer_id) => {
      const customerDetail = await CustomerModel.find(customer_id);

      return customerDetail.delete();
    },
    validateUserCredential: async (customer_id, references) => {
      const customer = await CustomerModel.find(customer_id);

      customer.merge({ is_validated: true });

      await customer.save();

      return _withReferences(references)
        .where({ customer_id })
        .fetch()
        .then((response) => response.first());
    },
    hasCredentialValidated: (customer_id) => {
      return CustomerModel.query()
        .where({ customer_id, is_validated: true })
        .fetch()
        .then((response) => response.first());
    },
    ratingDoBelongToCustomer: (customer_id, credential_rating_id) => {
      return CustomerModel.query()
        .with("credentialRating", (builder) =>
          builder.where({ credential_rating_id })
        )
        .where({ customer_id })
        .fetch()
        .then((response) => response.first());
    },
    findExistingOrder: (customer_id, product_id) => {
      return CustomerModel.query()
        .with("orders", (builder) => {
          builder.where({ product_id });
        })
        .where({ customer_id })
        .fetch()
        .then((response) => response.first().getRelated("orders").first());
    },
    findProductOnAuthUser: (customer_id, product_id) => {
      return CustomerModel.query()
        .with("products", (builder) => {
          builder.where({ product_id });
        })
        .where({ customer_id })
        .fetch()
        .then((response) => response.first().getRelated("products").first());
    },
    findBidOnThisCustomer: (customer_id, bid_id) => {
      return CustomerModel.query()
        .with("bids", (builder) => builder.where({ bid_id }))
        .where({ customer_id })
        .fetch()
        .then((response) => response.first().getRelated("bids").first());
    },
  };
};
