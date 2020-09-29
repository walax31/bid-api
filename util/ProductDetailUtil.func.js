module.exports = function (ProductDetailModel) {
  const _withReferences = (references) => {
    const _ProductDetail = ProductDetailModel.query();

    if (references) {
      const extractedReferences = references.split(",");

      extractedReferences.forEach((reference) =>
        _ProductDetail.with(reference)
      );
    }

    return _ProductDetail;
  };

  return {
    getAll: (references, page = 1, per_page = 10) => {
      return _withReferences(references).paginate(page, per_page);
    },
    getById: (uuid, references) => {
      return _withReferences(references)
        .where({ uuid })
        .fetch()
        .then((response) => response.first());
    },
    create: async (attributes, references) => {
      const { uuid } = await ProductDetailModel.create(attributes);

      return _withReferences(references)
        .where({ uuid })
        .fetch()
        .then((response) => response.first());
    },
    updateById: async (uuid, attributes, references) => {
      let productDetail = await ProductDetailModel.find(uuid);

      productDetail.merge(attributes);

      await productDetail.save();

      return _withReferences(references)
        .where({ uuid })
        .fetch()
        .then((response) => response.first());
    },
    deleteById: async (uuid) => {
      const productDetail = await ProductDetailModel.find(uuid);

      return productDetail.delete();
    },
  };
};
