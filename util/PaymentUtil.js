class Payment {
  constructor(PaymentModel) {
    this._Payment = Payment;
  }

  _withReferences(model, references) {
    if (references) {
      const extractedReferences = references.split(",");

      extractedReferences.forEach((reference) => model.with(reference));
    }

    return model;
  }

  getAll(references) {
    const payments = this._Payment.query();

    return this._withReferences(payments, references).fetch();
  }

  getById(order_id, references) {
    const payment = this._Payment.query();

    return this._withReferences(payment, references)
      .where({ order_id })
      .fetch()
      .then((response) => response.first());
  }
  async create(attributes, references) {
    const { order_id } = await this._Payment.create(attributes);

    const payment = this._Payment.query();

    return this._withReferences(payment, references)
      .where({ order_id })
      .fetch()
      .then((response) => response.first());
  }

  async updateById(order_id, attributes, references) {
    let payment = await this._Payment.find(order_id);

    payment.merge(attributes);

    await payment.save();

    payment = this._Payment.query();

    return this._withReferences(payment, references)
      .where({ order_id })
      .fetch()
      .then((response) => response.first());
  }

  async deleteById(order_id) {
    const payment = this._Payment.find(order_id);

    return payment.delete();
  }
}
