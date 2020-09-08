class BidUtil {
  constructor(BidModel) {
    this._Bid = BidModel;
  }

  _withReferences(model, references) {
    if (references) {
      const extractedReferences = references.split(",");

      extractedReferences.forEach((reference) => model.with(reference));
    }

    return model;
  }

  getAll(references) {
    const bids = this._Bid.query();

    return this._withReferences(bids, references).fetch();
  }

  getById(bid_id, references) {
    const bid = this._Bid.query();

    return this._withReferences(bid, references)
      .where({ bid_id })
      .fetch()
      .then((response) => response.first());
  }

  async create(attributes, references) {
    const { bid_id } = await this._Bid.create(attributes);

    const bid = this._Bid.query();

    return this._withReferences(bid, references)
      .where({ bid_id })
      .fetch()
      .then((response) => response.first());
  }

  async updateById(bid_id, attributes, references) {
    let bid = await this._Bid.find(bid_id);

    bid.merge(attributes);

    await bid.save();

    bid = this._Bid.query();

    return this._withReferences(bid, references)
      .where({ bid_id })
      .fetch()
      .then((response) => response.first());
  }

  async deleteById(bid_id) {
    const bid = await this._Bid.find(bid_id);

    return bid.delete();
  }
}
