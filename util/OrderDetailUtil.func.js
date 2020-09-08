module.exports = function (OrderDetailModel) {
  const _withReferences = (references) => {
    const _OrderDetail = OrderDetailModel.query();

    if (references) {
      const extractedReferences = references.split(",");

      extractedReferences.forEach((reference) => _OrderDetail.with(reference));
    }

    return _OrderDetail;
  };

  return {
    getAll: (references) => {
      return _withReferences(references).fetch();
    },
    getById: (order_detail_id, references) => {
      return _withReferences(references)
        .where({ order_detail_id })
        .fetch()
        .then((response) => response.first());
    },
    create: async (attributes, references) => {
      const { order_detail_id } = await OrderDetailModel.create(attributes);

      return _withReferences(references)
        .where({ order_detail_id })
        .fetch()
        .then((response) => response.first());
    },
    updateById: async (order_detail_id, references) => {
      let orderDetail = await OrderDetailModel.find(order_detail_id);

      orderDetail.merge(attributes);

      await orderDetail.save();

      return _withReferences(references)
        .where({ order_detail_id })
        .fetch()
        .then((response) => response.first());
    },
    deleteById: async (order_detail_id) => {
      const orderDetail = await OrderDetailModel.find(order_detail_id);

      return orderDetail.delete();
    },
  };
};
