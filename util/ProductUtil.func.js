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
    getAll: (references, page = 1, per_page = 10) => {
      return _withReferences(references).paginate(page, per_page);
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
    updateById: async (product_id, attributes, references) => {
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
    findExistingBidOnThisProduct: (product_id) => {
      return ProductModel.query()
        .with("bids")
        .where({ product_id })
        .fetch()
        .then((response) => response.first().getRelated("bids").rows);
    },
    flagProductAsBidable: async (product_id) => {
      const product = await ProductModel.find(product_id);

      product.merge({ is_bidable: true });

      await product.save();

      return ProductModel.query()
        .where({ product_id })
        .fetch()
        .then((response) => response.first());
    },
    bulkHasBidableFlag: (references, page = 1, per_page = 10) => {
      return _withReferences(references)
        .where({ is_bidable: true })
        .paginate(page, per_page);
    },
    hasBidableFlag: (product_id, references) => {
      return _withReferences(references)
        .where({ product_id, is_bidable: true })
        .fetch()
        .then((response) => response.first());
    },
    findExistingBidForThisProduct: (customer_id, product_id) => {
      return ProductModel.query()
        .with("bids", (builder) => {
          builder.where({ customer_id });
        })
        .where({ product_id })
        .fetch()
        .then((response) => response.first());
    },
    productIsModeratedByCustomer: (customer_id, product_id) => {
      return ProductModel.query()
        .with("customer", (builder) => builder.where({ customer_id }))
        .where({ product_id })
        .fetch()
        .then((response) => response.first());
    },
  };
};
