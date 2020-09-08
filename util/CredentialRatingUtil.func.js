module.exports = function (CredentialRatingModel) {
  const _withReferences = (references) => {
    const _CredentialRating = CredentialRatingModel.query();

    if (references) {
      const extractedReferences = references.split(",");

      extractedReferences.forEach((reference) =>
        _CredentialRating.with(reference)
      );
    }

    return _CredentialRating;
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
      const { customer_id } = await CredentialRatingModel.create(attributes);

      return _withReferences(references)
        .where({ customer_id })
        .fetch()
        .then((response) => response.first());
    },
    updateById: async (customer_id, attributes, references) => {
      let CredentialRatingDetail = await CredentialRatingModel.find(
        customer_id
      );

      CredentialRatingDetail.merge(attributes);

      await CredentialRatingDetail.save();

      return _withReferences(references)
        .where({ customer_id })
        .fetch()
        .then((response) => response.first());
    },
    deleteById: async (customer_id) => {
      const CredentialRatingDetail = await CredentialRatingModel.find(
        customer_id
      );

      return CredentialRatingDetail.delete();
    },
  };
};
