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
      const { product_id } = await ProductDetailModel.create(attributes);

      return _withReferences(references)
        .where({ product_id })
        .fetch()
        .then((response) => response.first());
    },
    updateById: async (product_id, attributes, references) => {
      let productDetail = await ProductDetailModel.find(product_id);

      productDetail.merge(attributes);

      await productDetail.save();

      return _withReferences(references)
        .where({ product_id })
        .fetch()
        .then((response) => response.first());
    },
    deleteById: async (product_id) => {
      const productDetail = await ProductDetailModel.find(product_id);

      return productDetail.delete();
    },
    findExistingProductViaUser: (UserModel, user_id, product_id) => {
      return UserModel.query()
        .with("customer.products", (builder) => {
          builder.where({ customer_id: user_id, product_id });
        })
        .where({ user_id })
        .fetch()
        .then((response) =>
          response.first().getRelated("customer").getRelated("products").first()
        );
    },
  };
};
