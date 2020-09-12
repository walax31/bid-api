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
    getAll: (references) => {
      return _withReferences(references).fetch();
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
    deleteById: async (user_id) => {
      const user = await UserModel.find(user_id);

      return user.delete();
    },
  };
};
