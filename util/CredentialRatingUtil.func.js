module.exports = function makeCredentialRatingUtil (CredentialRatingModel) {
  const withReferences = references => {
    const CredentialRating = CredentialRatingModel.query()

    if (references) {
      const extractedReferences = references.split(',')

      extractedReferences.forEach(reference =>
        CredentialRating.with(reference))
    }

    return CredentialRating
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
      const { uuid } = await CredentialRatingModel.create(attributes)

      return withReferences(references)
        .where({ uuid })
        .fetch()
        .then(response => response.first())
    },
    updateById: async (uuid, attributes, references) => {
      const CredentialRatingDetail = await CredentialRatingModel.find(uuid)

      CredentialRatingDetail.merge(attributes)

      await CredentialRatingDetail.save()

      return withReferences(references)
        .where({ uuid })
        .fetch()
        .then(response => response.first())
    },
    deleteById: uuid =>
      CredentialRatingModel.find(uuid).then(response => response.delete())
  }
}
