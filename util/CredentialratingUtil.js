class CredentialRatingUtil {
  constructor(credentialRatingModel) {
    this._Rating = credentialRatingModel;
  }

  _withReferences(model, references) {
    if (references) {
      const extractedReferences = references.split(",");

      extractedReferences.forEach((reference) => model.with(reference));
    }

    return model;
  }

  getAll(references) {
    const rating = this._Rating.query();

    return this._withReferences(rating, references).fetch();
  }

  getById(credential_rating_id, references) {
    const rating = this._Rating.query();

    return this._withReferences(rating, references)
      .where({ credential_rating_id })
      .fetch()
      .then((response) => response.first());
  }

  async create(attributes, references) {
    const { credential_rating_id } = await this._Rating.create(attributes);

    const rating = this._Rating.query();

    return this._withReferences(rating, references)
      .where({ credential_rating_id })
      .fetch()
      .then((response) => response.first());
  }

  async updateById(credential_rating_id, attributes, references) {
    let rating = await this._Rating.find(credential_rating_id);

    rating.merge(attributes);

    await rating.save();

    rating = this._Rating.query();

    return this._withReferences(rating, references)
      .where({ credential_rating_id })
      .fetch()
      .then((response) => response.first());
  }

  async deleteById(credential_rating_id) {
    const rating = await this._Rating.find(credential_rating_id);

    return rating.delete();
  }
}
