module.exports = function makeAlertUtil (AlertModel) {
  const withReferences = references => {
    const alert = AlertModel.query()

    if (references) {
      const extractedReferences = references.split(',')

      extractedReferences.forEach(reference => alert.with(reference))
    }

    return alert
  }

  return {
    getAll: (user_uuid, references, onPage = 1, perPage = 10) =>
      withReferences(references).where({ user_uuid }).paginate(onPage, perPage),
    getById: (uuid, user_uuid, references) =>
      withReferences(references)
        .where({ uuid, user_uuid })
        .fetch()
        .then(response => response.first()),
    getByReference: (uuid, reference, references) =>
      withReferences(references)
        .where({ user_uuid: uuid, reference })
        .fetch()
        .then(response => response.first()),
    create: async (attributes, references) => {
      const { uuid } = await AlertModel.create(attributes).then(response =>
        response.toJSON())

      return withReferences(references)
        .where({ uuid })
        .fetch()
        .then(response => response.first())
    },
    updateById: async (uuid, attributes, references) => {
      const alert = await AlertModel.find(uuid)

      alert.merge(attributes)

      await alert.save()

      return withReferences(references)
        .where({ uuid })
        .fetch()
        .then(response => response.first())
    },
    deleteById: uuid =>
      AlertModel.find(uuid).then(response => response.delete()),
    getAllValid: (user_uuid, references, page = 1, per_page = 5) =>
      withReferences(references)
        .where({
          is_expired: false,
          is_proceeded: false,
          is_cancelled: false,
          user_uuid
        })
        .paginate(page, per_page),
    alertBelongToUser: (uuid, user_uuid) =>
      AlertModel.query()
        .where({ uuid, user_uuid })
        .fetch()
        .then(response => response.first())
  }
}
