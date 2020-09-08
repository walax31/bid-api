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
    getById: (customer_id, references) => {
      return _withReferences(references)
        .where({ customer_id })
        .fetch()
        .then((response) => response.first());
    },
    create: async (attributes, references) => {
      const { customer_id } = await UserModel.create(attributes);

      return _withReferences(references)
        .where({ customer_id })
        .fetch()
        .then((response) => response.first());
    },
    updateById: async (customer_id, attributes, references) => {
      let user = await UserModel.find(customer_id);

      user.merge(attributes);

      await user.save();

      return _withReferences(references)
        .where({ customer_id })
        .fetch()
        .then((response) => response.first());
    },
    deleteById: async (customer_id) => {
      const user = await UserModel.find(customer_id);

      return user.delete();
    },
  };
};
