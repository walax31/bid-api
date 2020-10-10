module.exports = function (CronModel) {
  const _withReferences = (references) => {
    const _CronJob = CronModel.query();

    if (references) {
      const extractedReferences = references.split(",");

      extractedReferences.forEach((reference) => {
        _CronJob.with(reference);
      });
    }

    return _CronJob;
  };

  return {
    getAll: (references, page = 1, per_page = 10) => {
      return _withReferences(references).paginate(page, per_page);
    },
    getById: (uuid, references) => {
      return _withReferences(references)
        .where({ uuid })
        .fetch()
        .then((response) => response.first());
    },
    getByToken: (content, references) => {
      return _withReferences(references)
        .where({ content })
        .fetch()
        .then((response) => response.first());
    },
    create: async (attributes, references) => {
      const { uuid } = await CronModel.create(attributes);

      return _withReferences(references)
        .where({ uuid })
        .fetch()
        .then((response) => response.first());
    },
    updateById: async (uuid, attributes, references) => {
      await CronModel.find(uuid).then(async (cron) => {
        cron.merge(attributes);

        await cron.save();
      });

      return _withReferences(references)
        .where({ uuid })
        .fetch()
        .then((response) => response.first());
    },
    updateByToken: async (content, attributes, references) => {
      await CronModel.findBy("content", content).then(async (cron) => {
        cron.merge(attributes);

        await cron.save();
      });

      return _withReferences(references)
        .where({ content })
        .fetch()
        .then((response) => response.first());
    },
    deleteById: (uuid) => {
      return CronModel.find(uuid).then((response) => response.delete());
    },
  };
};
