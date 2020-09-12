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
    getAll: (references, customer_id) => {
      if (customer_id)
        return _withReferences(references).where({ customer_id }).fetch();

      return _withReferences(references).fetch();
    },
    getById: (bid_id, references) => {
      return _withReferences(references)
        .where({ bid_id })
        .fetch()
        .then((response) => response.first());
    },
    create: async (attributes, references) => {
      const { bid_id } = await BidModel.create(attributes);

      return _withReferences(references)
        .where({ bid_id })
        .fetch()
        .then((response) => response.first());
    },
    updateById: async (bid_id, attributes, references) => {
      let bid = await BidModel.find(bid_id);

      bid.merge(attributes);

      await bid.save();

      return _withReferences(references)
        .where({ bid_id })
        .fetch()
        .then((response) => response.first());
    },
    deleteById: async (bid_id) => {
      const bid = await BidModel.find(bid_id);

      return bid.delete();
    },
  };
};
