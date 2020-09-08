class ProductDetailUtil {
  constructor(ProductDetailModel) {
    this._ProductDetail = ProductDetailModel;
  }

  _withReferences(model, references) {
    if (references) {
      const extractedReferences = references.split(",");

      extractedReferences.forEach((reference) => model.with(reference));
    }

    return model;
  }

  getAll(references) {
    const productdetails = this._ProductDetail.query();

    return this._withReferences(productdetails, references).fetch();
  }

  getById(product_id, references) {
    const productdetail = this._ProductDetail.query();

    return this._withReferences(productdetail, references)
      .where({ product_id })
      .fetch()
      .then((response) => response.first());
  }

  async create(attributes, references) {
    const { product_id } = await this._ProductDetail.create(attributes);

    const product = this._ProductDetail.query();

    return this._withReferences(product, references)
      .where({ product_id })
      .fetch()
      .then((response) => response.first());
  }

  async updateById(product_id, attributes, references) {
    let product = await this._ProductDetail.create(attributes);

    product = this._ProductDetail.query();

    return this._withReferences(product, references)
      .where({ product_id })
      .fetch()
      .then((response) => response.first());
  }

  async deleteById(product_id) {
    const product = await this._ProductDetail.find(product_id);

    return product.delete();
  }
}
