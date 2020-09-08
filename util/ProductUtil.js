class ProductUtil {
  constructor(ProductModel) {
    this._Product = ProductModel;
  }

  _withReferences(model, references) {
    if (references) {
      const extractedReferences = references.split(",");

      extractedReferences.forEach((reference) => model.with(reference));
    }

    return model;
  }

  getAll(references) {
    const products = this._Product.query();

    return this._withReferences(products, references).fetch();
  }

  getById(product_id, references) {
    const product = this._Product.query();

    return this._withReferences(product, references)
      .where({ product_id })
      .fetch()
      .then((response) => response.first());
  }

  async create(attributes, references) {
    const { product_id } = await this._Product.create(attributes);

    const product = this._Product.query();

    return this._withReferences(product, references)
      .where({ product_id })
      .fetch()
      .then((response) => response.first());
  }

  async updateById(product_id, attributes, references) {
    let product = await this._Product.find(product_id);

    product.merge(attributes);

    await product.save();

    product = this._Product.query();

    return this._withReferences(product, references)
      .where({ product_id })
      .fetch();
  }

  async delete(product_id) {
    const product = await this._Product.find(product_id);

    return product.delete();
  }
}
