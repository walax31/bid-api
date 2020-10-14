module.exports = function makeTagUtil (TagModel) {
  const withReferences = references => {
    const Tag = TagModel.query()

    if (references) {
      const extractedReferences = references.split(',')

      extractedReferences.forEach(reference => Tag.with(reference))
    }

    return Tag
  }

  return {
    getAll: (reference, page = 1, per_page = 10) =>
      withReferences(reference).paginate(page, per_page),
    getById: (uuid, references) =>
      withReferences(references)
        .where({ uuid })
        .fetch()
        .then(response => response.first()),
    create: async (attributes, references) => {
      const { uuid } = await TagModel.create(attributes)

      return withReferences(references)
        .where({ uuid })
        .fetch()
        .then(response => response.first())
    },
    updateById: async (uuid, attributes, references) => {
      const tag = await TagModel.find(uuid)

      tag.merge(attributes)

      await tag.save()

      return withReferences(references)
        .where({ uuid })
        .fetch()
        .then(response => response.first())
    },
    deleteById: uuid =>
      TagModel.find(uuid).then(response => response.delete())
  }
}
