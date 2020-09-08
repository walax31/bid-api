class loginDetailUtil {
  constructor(loginModel) {
    this._Login = loginModel;
  }

  _withReferences(model, references) {
    if (references) {
      const extractedReferences = references.split(",");

      extractedReferences.forEach((reference) => {
        model.with(reference);
      });
    }

    return model;
  }

  async getAll(references) {
    const loginDetails = this._Login.query();

    return this._withReferences(loginDetails, references).fetch();
  }

  async getById(customer_id, references) {
    const loginDetail = this._Login.query();

    return this._withReferences(loginDetail, references)
      .where({ customer_id })
      .fetch()
      .then((response) => response.first());
  }

  async create(attributes, references) {
    const { customer_id } = await this._Login.create(attributes);

    const loginDetail = this._Login.query();

    return this._withReferences(loginDetail, references)
      .where({ customer_id })
      .fetch()
      .then((response) => response.first());
  }

  async updateById(id, attributes, references) {
    const customer = await this._Login.find(id);

    customer.merge(attributes);

    const { customer_id } = await customer._Login.save();

    const loginDetail = this._Login.query();

    return this._withReferences(loginDetail, references)
      .where({ customer_id })
      .fetch()
      .then((response) => response.first());
  }

  async destroyById(customer_id) {
    const customer = await this._Login.find(customer_id);

    return customer.delete();
  }
}

module.exports = loginDetailUtil;
