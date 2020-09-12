module.exports = function (OrderModel) {
  const _withReferences = (references) => {
    const _Order = OrderModel.query();

    if (references) {
      const extractedReferences = references.split(",");

      extractedReferences.forEach((reference) => _Order.with(reference));
    }

    return _Order;
  };

  const _findProductOnAuthUser = (UserModel, user_id, product_id) => {
    return UserModel.query()
      .with("customer.products", (builder) => {
        builder.where({ customer_id: user_id, product_id });
      })
      .where({ user_id })
      .fetch()
      .then((response) =>
        response.first().getRelated("customer").getRelated("products").first()
      );
  };

  const _findExistingOrder = (UserModel, customer_id, product_id) => {
    return UserModel.query()
      .with("customer.orders", (builder) => {
        builder.where({ customer_id, product_id });
      })
      .where({ user_id: customer_id })
      .fetch()
      .then((response) =>
        response.first().getRelated("customer").getRelated("orders").first()
      );
  };

  const _findExistingBidForThisProduct = (UserModel, user_id, product_id) => {
    return UserModel.query()
      .with("customer.bids.product", (builder) => {
        builder.where({ product_id });
      })
      .where({ user_id })
      .fetch()
      .then((response) =>
        response.first().getRelated("customer").getRelated("bids").first()
      );
  };

  return {
    getAll: (references, customer_id) => {
      if (customer_id)
        return _withReferences(references).where({ customer_id }).fetch();

      return _withReferences(references).fetch();
    },
    getById: (order_id, references) => {
      return _withReferences(references)
        .where({ order_id })
        .fetch()
        .then((response) => response.first());
    },
    create: async (
      attributes,
      UserModel,
      auth_id,
      customer_id,
      product_id,
      references
    ) => {
      if (!(await _findProductOnAuthUser(UserModel, auth_id, product_id)))
        return {
          status: 403,
          error_msg: "cannot initiate order for product you don't own.",
        };

      if (
        !(await _findExistingBidForThisProduct(
          UserModel,
          customer_id,
          product_id
        ))
      )
        return {
          status: 404,
          error_msg: "this user never put a bid on your product.",
        };

      if (await _findExistingOrder(UserModel, customer_id, product_id))
        return {
          status: 500,
          error_msg: "order on this specific user has already existed.",
        };

      const { order_id } = await OrderModel.create(attributes);

      return {
        status: 200,
        data: _withReferences(references)
          .where({ order_id })
          .fetch()
          .then((response) => response.first()),
      };
    },
    updateById: async (order_id, attributes, references) => {
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
