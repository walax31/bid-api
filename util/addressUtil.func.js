module.exports = function (AddressModel) {
  const _withReferences = (references) => {
    const _address = AddressModel.query();

    if (references) {
      const extractedReferences = references.split(",");

      extractedReferences.forEach((reference) => _address.with(reference));
    }

    return _address;
  };

  return {
    getAll: (references, onPage = 1, perPage = 10) => {
      return _withReferences(references).paginate(onPage, perPage);
    },
    getById: (uuid, references, customer_uuid) => {
      return _withReferences(references)
        .where(customer_uuid ? { uuid } : { uuid, customer_uuid })
        .fetch()
        .then((response) => response.first());
    },
    create: async (attributes, references) => {
      const { uuid } = await AddressModel.create(attributes).then((response) =>
        response.toJSON()
      );

      return _withReferences(references)
        .where({ uuid })
        .fetch()
        .then((response) => response.toJSON());
    },
    updateById: async (uuid, attributes, references) => {
      const address = await AddressModel.find(uuid);

      address.merge(attributes);

      await address.save();

      return _withReferences(references)
        .where({ uuid })
        .fetch()
        .then((response) => response.first());
    },
    deleteById: (uuid) => {
      return AddressModel.find(uuid).then((response) => response.delete());
    },
  };
};
