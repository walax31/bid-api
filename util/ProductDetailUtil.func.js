module.exports = function makeProductDetailUtil (ProductDetailModel) {
  const withReferences = references => {
    const ProductDetail = ProductDetailModel.query()

    if (references) {
      const extractedReferences = references.split(',')

      extractedReferences.forEach(reference => ProductDetail.with(reference))
    }

    return ProductDetail
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
      const { uuid } = await ProductDetailModel.create(attributes)

      return withReferences(references)
        .where({ uuid })
        .fetch()
        .then(response => response.first())
    },
    updateById: async (uuid, attributes, references) => {
      const productDetail = await ProductDetailModel.find(uuid)

      productDetail.merge(attributes)

      await productDetail.save()

      return withReferences(references)
        .where({ uuid })
        .fetch()
        .then(response => response.first())
    },
    deleteById: uuid =>
      ProductDetailModel.find(uuid).then(response => response.delete())
  }
}
