class OrderDetailUtil {
  constructor(OrderDetailModel) {
    this._OrderDetail = OrderDetailModel;
  }

  _withReferences(model, references) {
    if (references) {
      const extractedReferences = references.split(",");

      extractedReferences.forEach((reference) => model.with(reference));
    }

    return model;
  }

  getAll(references) {
    const orderDetails = this._OrderDetail.query();

    return this._withReferences(orderDetails, references).fetch();
  }

  getById(order_detail_id, references) {
    const orderDetail = this._OrderDetail.query();

    return this._withReferences(orderDetail, references)
      .where({ order_detail_id })
      .fetch()
      .then((response) => response.first());
  }

  async create(attributes, references) {
    const { order_detail_id } = await this._OrderDetail.create(attributes);

    const order = this._OrderDetail.query();

    return this._withReferences(order, references)
      .where({ order_detail_id })
      .fetch()
      .then((response) => response.first());
  }

  async updateById(order_detail_id, attributes, references) {
    let orderDetail = await this._OrderDetail.find(order_detail_id);

    orderDetail.merge(attributes);

    await orderDetail.save();

    orderDetail = this._OrderDetail.query();

    return this._withReferences(orderDetail, references)
      .where({ order_detail_id })
      .fetch()
      .then((response) => response.first());
  }

  async deleteById(order_detail_id) {
    const orderDetail = await this._OrderDetail.find(order_detail_id);

    return orderDetail.delete();
  }
}
