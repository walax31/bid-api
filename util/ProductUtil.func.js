module.exports = function (ProductModel) {
  const _withReferences = (references) => {
    const _Product = ProductModel.query();

    if (references) {
      const extractedReferences = references.split(",");

      extractedReferences.forEach((reference) => _Product.with(reference));
    }

    return _Product;
  };

  return {
    getAll: (references) => {
      return _withReferences(references).fetch();
    },
    getById: (product_id, references) => {
      return _withReferences(references)
        .where({ product_id })
        .fetch()
        .then((response) => response.first());
    },
    create: async (attributes, references) => {
      const { product_id } = await ProductModel.create(attributes);

      return _withReferences(references)
        .where({ product_id })
        .fetch()
        .then((response) => response.first());
    },
    updateById: async (product_id, references) => {
      let product = await ProductModel.find(product_id);

      product.merge(attributes);

      await product.save();

      return _withReferences(references)
        .where({ product_id })
        .fetch()
        .then((response) => response.first());
    },
    deleteById: async (product_id) => {
      const product = await ProductModel.find(product_id);

      return product.delete();
    },
  };
};
