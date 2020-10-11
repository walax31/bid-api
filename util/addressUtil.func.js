module.exports = function makeAddressUtil (AddressModel) {
  const withReferences = references => {
    const address = AddressModel.query()

    if (references) {
      const extractedReferences = references.split(',')

      extractedReferences.forEach(reference => address.with(reference))
    }

    return address
  }

  return {
    getAll: (references, onPage = 1, perPage = 10) =>
      withReferences(references).paginate(onPage, perPage),
    getById: (uuid, references, customer_uuid) =>
      withReferences(references)
        .where(customer_uuid ? { uuid } : { uuid, customer_uuid })
        .fetch()
        .then(response => response.first()),
    create: async (attributes, references) => {
      const { uuid } = await AddressModel.create(attributes).then(response =>
        response.toJSON())

      return withReferences(references)
        .where({ uuid })
        .fetch()
        .then(response => response.toJSON())
    },
    updateById: async (uuid, attributes, references) => {
      const address = await AddressModel.find(uuid)

      address.merge(attributes)

      await address.save()

      return withReferences(references)
        .where({ uuid })
        .fetch()
        .then(response => response.first())
    },
    deleteById: uuid =>
      AddressModel.find(uuid).then(response => response.delete())
  }
}
