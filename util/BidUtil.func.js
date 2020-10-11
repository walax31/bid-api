module.exports = function makeBidUtil (BidModel) {
  const withReferences = references => {
    const Bid = BidModel.query()

    if (references) {
      const extractedReferences = references.split(',')

      extractedReferences.forEach(reference => Bid.with(reference))
    }

    return Bid
  }

  return {
    getAll: (references, onPage = 1, perPage = 10, customer_uuid) => {
      if (customer_uuid) {
        return withReferences(references)
          .where({ customer_uuid })
          .paginate(onPage, perPage)
      }

      return withReferences(references).paginate(onPage, perPage)
    },
    getById: (uuid, references) =>
      withReferences(references)
        .where({ uuid })
        .fetch()
        .then(response => response.first()),
    create: async (attributes, references) => {
      const { uuid } = await BidModel.create(attributes)

      return withReferences(references)
        .where({ uuid })
        .fetch()
        .then(response => response.first())
    },
    updateById: async (uuid, attributes, references) => {
      const bid = await BidModel.find(uuid)

      bid.merge(attributes)

      await bid.save()

      return withReferences(references)
        .where({ uuid })
        .fetch()
        .then(response => response.first())
    },
    deleteById: uuid =>
      BidModel.find(uuid).then(response => response.delete())
  }
}
