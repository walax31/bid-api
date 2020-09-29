module.exports = function (UserModel) {
  const _withReferences = (references) => {
    const _User = UserModel.query();

    if (references) {
      const extractedReferences = references.split(",");

      extractedReferences.forEach((reference) => _User.with(reference));
    }

    return _User;
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
    create: async (attributes, references) => {
      const { uuid } = await UserModel.create(attributes);

      return _withReferences(references)
        .where({ uuid })
        .fetch()
        .then((response) => response.first());
    },
    updateById: async (uuid, attributes, references) => {
      const user = await UserModel.findBy("uuid", uuid);

      user.merge(attributes);

      await user.save();

      return _withReferences(references)
        .where({ uuid })
        .fetch()
        .then((response) => response.first());
    },
    flagSubmition: async (uuid, references) => {
      const user = await UserModel.findBy("uuid", uuid);

      user.merge({ is_submitted: true });

      await user.save();

      return _withReferences(references)
        .where({ uuid })
        .fetch()
        .then((response) => response.first());
    },
    hasSubmittionFlagged: (uuid) => {
      return UserModel.query()
        .with("customer")
        .where({ uuid, is_submitted: true })
        .fetch()
        .then((response) => response.first().getRelated("customer"));
    },
    deleteById: async (uuid) => {
      const user = await UserModel.findBy("uuid", uuid);

      return user.delete();
    },
  };
};
