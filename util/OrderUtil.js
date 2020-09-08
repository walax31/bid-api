class OrderUtil {
  constructor(OrderModel) {
    this._Order = OrderModel;
  }

  _withReferences(model, references) {
    if (references) {
      const extractedReferences = references.split(",");

      extractedReferences.forEach((reference) => model.with(reference));
    }

    return model;
  }

  getAll(references) {
    const orders = this._Order.query();

    return this._withReferences(orders, references).fetch();
  }

  getById(order_id, references) {
    const order = this._Order.query();

    return this._withReferences(order, references)
      .where({ order_id })
      .fetch()
      .then((response) => response.first());
  }

  async create(attributes, references) {
    const { order_id } = await this._Order.create(attributes);

    const order = this._Order.query();

    return this._withReferences(order, references)
      .where({ order_id })
      .fetch()
      .then((response) => response.first());
  }

  async updateById(order_id, attributes, references) {
    let order = await this._Order.find(order_id);

    order.merge(attributes);

    await order.save();

    order = this._Order.query();

    return this._withReferences(order, references)
      .where({ order_id })
      .fetch()
      .then((response) => response.first());
  }

  async deleteById(order_id) {
    const order = await this._Order.find(order_id);

    return order.delete();
  }
}
