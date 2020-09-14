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
    getById: (user_id, references) => {
      return _withReferences(references)
        .where({ user_id })
        .fetch()
        .then((response) => response.first());
    },
    create: async (attributes, references) => {
      const { user_id } = await UserModel.create(attributes);

      return _withReferences(references)
        .where({ user_id })
        .fetch()
        .then((response) => response.first());
    },
    updateById: async (user_id, attributes, references) => {
      const user = await UserModel.find(user_id);

      user.merge(attributes);

      await user.save();

      return _withReferences(references)
        .where({ user_id })
        .fetch()
        .then((response) => response.first());
    },
    flagSubmition: async (user_id, references) => {
      const user = await UserModel.find(user_id);

      user.merge({ is_submitted: true });

      await user.save();

      return _withReferences(references)
        .where({ user_id })
        .fetch()
        .then((response) => response.first());
    },
    hasSubmittionFlagged: (user_id) => {
      return UserModel.query()
        .with("customer")
        .where({ user_id, is_submitted: true })
        .fetch()
        .then((response) => response.first().getRelated("customer"));
    },
    deleteById: async (user_id) => {
      const user = await UserModel.find(user_id);

      return user.delete();
    },
  };
};
