module.exports = function (AlertModel) {
  const _withReferences = (references) => {
    const _alert = AddressModel.query();

    if (references) {
      const extractedReferences = references.split(",");

      extractedReferences.forEach((reference) => _alert.with(reference));
    }

    return _alert;
  };

  return {
    getAll: (user_uuid, references, onPage = 1, perPage = 10) => {
      return _withReferences(references)
        .where({ user_uuid })
        .paginate(onPage, perPage);
    },
    getById: (uuid, user_uuid, references) => {
      return _withReferences(references)
        .where({ uuid, user_uuid })
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
        .then((response) => response.first());
    },
    updateById: async (uuid, attributes, references) => {
      const alert = await AddressModel.find(uuid);

      alert.merge(attributes);

      await alert.save();

      return _withReferences(references)
        .where({ uuid })
        .fetch()
        .then((response) => response.first());
    },
    deleteById: (uuid) => {
      return AlertModel.find(uuid).then((response) => response.delete());
    },
  };
};
