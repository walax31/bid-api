module.exports = function cronjobUtil (CronModel) {
  const withReferences = references => {
    const CronJob = CronModel.query()

    if (references) {
      const extractedReferences = references.split(',')

      extractedReferences.forEach(reference => {
        CronJob.with(reference)
      })
    }

    return CronJob
  }

  return {
    getAll: (references, page = 1, per_page = 10) =>
      withReferences(references).paginate(page, per_page),
    getById: (uuid, references) =>
      withReferences(references)
        .where({ uuid })
        .fetch()
        .then(response => response.first()),
    getByToken: (content, references) =>
      withReferences(references)
        .where({ content })
        .fetch()
        .then(response => response.first()),
    create: async (attributes, references) => {
      const { uuid } = await CronModel.create(attributes)

      return withReferences(references)
        .where({ uuid })
        .fetch()
        .then(response => response.first())
    },
    updateById: async (uuid, attributes, references) => {
      await CronModel.find(uuid).then(async cron => {
        cron.merge(attributes)

        await cron.save()
      })

      return withReferences(references)
        .where({ uuid })
        .fetch()
        .then(response => response.first())
    },
    updateByToken: async (content, attributes, references) => {
      await CronModel.findBy('content', content).then(async cron => {
        cron.merge(attributes)

        await cron.save()
      })

      return withReferences(references)
        .where({ content })
        .fetch()
        .then(response => response.first())
    },
    deleteById: uuid =>
      CronModel.find(uuid).then(response => response.delete())
  }
}
