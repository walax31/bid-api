module.exports = function (OrderModel) {
  const _withReferences = (references) => {
    const _Order = OrderModel.query();

    if (references) {
      const extractedReferences = references.split(",");

      extractedReferences.forEach((reference) => _Order.with(reference));
    }

    return _Order;
  };

  return {
    getAll: (references) => {
      return _withReferences(references).fetch();
    },
    getById: (order_id, references) => {
      return _withReferences(references)
        .where({ order_id })
        .fetch()
        .then((response) => response.first());
    },
    create: async (attributes, references) => {
      const { order_id } = await OrderModel.create(attributes);

      return _withReferences(references)
        .where({ order_id })
        .fetch()
        .then((response) => response.first());
    },
    updateById: async (order_id, references) => {
      let order = await OrderModel.find(order_id);

      order.merge(attributes);

      await order.save();

      return _withReferences(references)
        .where({ order_id })
        .fetch()
        .then((response) => response.first());
    },
    deleteById: async (order_id) => {
      const order = await OrderModel.find(order_id);

      return order.delete();
    },
  };
};
