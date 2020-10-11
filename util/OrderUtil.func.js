module.exports = function makeOrderUtil (OrderModel) {
  const withReferences = references => {
    const Order = OrderModel.query()

    if (references) {
      const extractedReferences = references.split(',')

      extractedReferences.forEach(reference => Order.with(reference))
    }

    return Order
  }

  return {
    getAll: (references, customer_uuid) => {
      if (customer_uuid) {
        return withReferences(references).where({ customer_uuid }).fetch()
      }

      return withReferences(references).fetch()
    },
    getById: (uuid, references, customer_uuid) => {
      if (customer_uuid) {
        return withReferences(references)
          .where({ uuid, customer_uuid })
          .fetch()
          .then(response => response.first())
      }

      return withReferences(references)
        .where({ uuid })
        .fetch()
        .then(response => response.first())
    },
    create: async (attributes, references) => {
      const { uuid } = await OrderModel.create(attributes)

      return withReferences(references)
        .where({ uuid })
        .fetch()
        .then(response => response.first())
    },
    updateById: async (uuid, attributes, references) => {
      const order = await OrderModel.find(uuid)

      order.merge(attributes)

      await order.save()

      return withReferences(references)
        .where({ uuid })
        .fetch()
        .then(response => response.first())
    },
    deleteById: uuid =>
      OrderModel.find(uuid).then(response => response.delete())
  }
}
