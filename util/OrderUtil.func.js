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
    getAll: (references, customer_uuid) => {
      if (customer_uuid)
        return _withReferences(references).where({ customer_uuid }).fetch();

      return _withReferences(references).fetch();
    },
    getById: (uuid, references, customer_uuid) => {
      if (customer_uuid)
        return _withReferences(references)
          .where({ uuid, customer_uuid })
          .fetch()
          .then((response) => response.first());

      return _withReferences(references)
        .where({ uuid })
        .fetch()
        .then((response) => response.first());
    },
    create: async (attributes, references) => {
      const { uuid } = await OrderModel.create(attributes);

      return _withReferences(references)
        .where({ uuid })
        .fetch()
        .then((response) => response.first());
    },
    updateById: async (uuid, attributes, references) => {
      let order = await OrderModel.find(uuid);

      order.merge(attributes);

      await order.save();

      return _withReferences(references)
        .where({ uuid })
        .fetch()
        .then((response) => response.first());
    },
    deleteById: async (uuid) => {
      const order = await OrderModel.find(uuid);

      return order.delete();
    },
  };
};
