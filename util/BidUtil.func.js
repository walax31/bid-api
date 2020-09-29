module.exports = function (BidModel) {
  const _withReferences = (references) => {
    const _Bid = BidModel.query();

    if (references) {
      const extractedReferences = references.split(",");

      extractedReferences.forEach((reference) => _Bid.with(reference));
    }

    return _Bid;
  };

  return {
    getAll: (references, onPage = 1, perPage = 10, customer_uuid) => {
      if (customer_uuid)
        return _withReferences(references)
          .where({ customer_uuid })
          .paginate(onPage, perPage);

      return _withReferences(references).paginate(onPage, perPage);
    },
    getById: (uuid, references) => {
      return _withReferences(references)
        .where({ uuid })
        .fetch()
        .then((response) => response.first());
    },
    create: async (attributes, references) => {
      const { uuid } = await BidModel.create(attributes);

      return _withReferences(references)
        .where({ uuid })
        .fetch()
        .then((response) => response.first());
    },
    updateById: async (uuid, attributes, references) => {
      let bid = await BidModel.find(uuid);

      bid.merge(attributes);

      await bid.save();

      return _withReferences(references)
        .where({ uuid })
        .fetch()
        .then((response) => response.first());
    },
    deleteById: async (uuid) => {
      const bid = await BidModel.find(uuid);

      return bid.delete();
    },
  };
};
