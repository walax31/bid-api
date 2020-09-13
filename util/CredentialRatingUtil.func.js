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
    getAll: (references, page = 1, per_page = 10) => {
      return _withReferences(references).paginate(page, per_page);
    },
    getById: (credential_rating_id, references) => {
      return _withReferences(references)
        .where({ credential_rating_id })
        .fetch()
        .then((response) => response.first());
    },
    create: async (attributes, references) => {
      const { credential_rating_id } = await CredentialRatingModel.create(
        attributes
      );

      return _withReferences(references)
        .where({ credential_rating_id })
        .fetch()
        .then((response) => response.first());
    },
    updateById: async (credential_rating_id, attributes, references) => {
      let CredentialRatingDetail = await CredentialRatingModel.find(
        credential_rating_id
      );

      CredentialRatingDetail.merge(attributes);

      await CredentialRatingDetail.save();

      return _withReferences(references)
        .where({ credential_rating_id })
        .fetch()
        .then((response) => response.first());
    },
    deleteById: async (credential_rating_id) => {
      const CredentialRatingDetail = await CredentialRatingModel.find(
        credential_rating_id
      );

      return CredentialRatingDetail.delete();
    },
  };
};
