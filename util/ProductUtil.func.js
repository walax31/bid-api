module.exports = function makeProductUtil (ProductModel) {
  const withReferences = references => {
    const Product = ProductModel.query()

    if (references) {
      const extractedReferences = references.split(',')

      extractedReferences.forEach(reference => Product.with(reference))
    }

    return Product
  }

  const withTagFilter = (tags, query) => {
    if (tags) {
      const extractedTags = tags.split(',')

      extractedTags.forEach(tag =>
        query.with('tags', builder => builder.where({ tag_name: tag })))
    }

    return query
  }

  return {
    getAll: (references, page = 1, per_page = 10) =>
      withReferences(references).paginate(page, per_page),
    getById: (uuid, references) =>
      withReferences(references)
        .where({ uuid })
        .fetch()
        .then(response => response.first()),
    create: async (attributes, references) => {
      const { uuid } = await ProductModel.create(attributes)

      return withReferences(references)
        .where({ uuid })
        .fetch()
        .then(response => response.first())
    },
    updateById: async (uuid, attributes, references) => {
      const product = await ProductModel.findBy('uuid', uuid)

      product.merge(attributes)

      await product.save()

      return withReferences(references)
        .where({ uuid })
        .fetch()
        .then(response => response.first())
    },
    deleteById: uuid =>
      ProductModel.findBy('uuid', uuid).then(response => response.delete()),
    findExistingBidOnThisProduct: uuid =>
      ProductModel.query()
        .with('bids')
        .where({ uuid })
        .fetch()
        .then(response => response.first().getRelated('bids')),
    flagProductAsBiddable: async uuid => {
      const product = await ProductModel.find(uuid)

      product.merge({ is_biddable: true })

      await product.save()

      return ProductModel.query()
        .where({ uuid })
        .fetch()
        .then(response => response.first())
    },
    bulkHasBiddableFlag: (references, page = 1, per_page = 10) =>
      withReferences(references)
        .where({ is_biddable: true })
        .paginate(page, per_page),
    hasBiddableFlag: (uuid, references) =>
      withReferences(references)
        .where({ uuid, is_biddable: true })
        .fetch()
        .then(response => response.first()),
    findExistingBidOnThisProductViaCustomer: (customer_uuid, product_uuid) =>
      ProductModel.query()
        .with('bids', builder => {
          builder.where({ customer_uuid })
        })
        .where({ uuid: product_uuid })
        .fetch()
        .then(response => response.first().getRelated('bids')),
    productIsModeratedByCustomer: (customer_uuid, product_uuid) =>
      ProductModel.query()
        .with('customer', builder => builder.where({ uuid: customer_uuid }))
        .where({ uuid: product_uuid })
        .fetch()
        .then(response => response.first()),
    getByTags: (tags, references, page = 1, per_page = 10) => {
      const query = withReferences(references)
      const nextQuery = withTagFilter(tags, query)
      return nextQuery.paginate(page, per_page)
    }
  }
}
