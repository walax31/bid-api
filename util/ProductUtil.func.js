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
    getById: (uuid, references) => {
      return _withReferences(references)
        .where({ uuid })
        .fetch()
        .then((response) => response.first());
    },
    create: async (attributes, references) => {
      const { uuid } = await ProductModel.create(attributes);

      return _withReferences(references)
        .where({ uuid })
        .fetch()
        .then((response) => response.first());
    },
    updateById: async (uuid, attributes, references) => {
      let product = await ProductModel.findBy("uuid", uuid);

      product.merge(attributes);

      await product.save();

      return _withReferences(references)
        .where({ uuid })
        .fetch()
        .then((response) => response.first());
    },
    deleteById: async (uuid) => {
      const product = await ProductModel.findBy("uuid", uuid);

      return product.delete();
    },
    findExistingBidOnThisProduct: (uuid) => {
      return ProductModel.query()
        .with("bids")
        .where({ uuid })
        .fetch()
        .then((response) => response.first().getRelated("bids").rows);
    },
    flagProductAsBiddable: async (uuid) => {
      const product = await ProductModel.find(uuid);

      product.merge({ is_biddable: true });

      await product.save();

      return ProductModel.query()
        .where({ uuid })
        .fetch()
        .then((response) => response.first());
    },
    bulkHasBiddableFlag: (references, page = 1, per_page = 10) => {
      return _withReferences(references)
        .where({ is_biddable: true })
        .paginate(page, per_page);
    },
    hasBiddableFlag: (uuid, references) => {
      return _withReferences(references)
        .where({ uuid, is_biddable: true })
        .fetch()
        .then((response) => response.first());
    },
    findExistingBidForThisProduct: (customer_uuid, product_uuid) => {
      return ProductModel.query()
        .with("bids", (builder) => {
          builder.where({ uuid: customer_uuid });
        })
        .where({ uuid: product_uuid })
        .fetch()
        .then((response) => response.first());
    },
    productIsModeratedByCustomer: (customer_uuid, product_uuid) => {
      return ProductModel.query()
        .with("customer", (builder) => builder.where({ uuid: customer_uuid }))
        .where({ uuid: product_uuid })
        .fetch()
        .then((response) => response.first());
    },
  };
};
