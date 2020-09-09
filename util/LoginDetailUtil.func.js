module.exports = function (LoginModel) {
  const _withReferences = (references) => {
    const _Login = LoginModel.query();

    if (references) {
      const extractedReferences = references.split(",");

      extractedReferences.forEach((reference) => _Login.with(reference));
    }

    return _Login;
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
      const { customer_id } = await LoginModel.create(attributes);

      return _withReferences(references)
        .where({ customer_id })
        .fetch()
        .then((response) => response.first());
    },
    updateById: async (customer_id, attributes, references) => {
      let loginDetail = await LoginModel.find(customer_id);

      loginDetail.merge(attributes);

      await loginDetail.save();

      return _withReferences(references)
        .where({ customer_id })
        .fetch()
        .then((response) => response.first());
    },
    deleteById: async (customer_id) => {
      const loginDetail = await LoginModel.find(customer_id);

      return loginDetail.delete();
    },
  };
};
