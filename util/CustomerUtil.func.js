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
    getAll: (references) => {
      return _withReferences(references).fetch();
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
    updateById: async (customer_id, references) => {
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
  };
};
