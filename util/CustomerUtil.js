class CustomerUtil {
  constructor(customerModel) {
    this._Customer = customerModel;
  }

  _withReferences(model, references) {
    if (references) {
      const extractedReferences = references.split(",");
      extractedReferences.forEach((reference) => model.with(reference));
    }

    return model;
  }

  getAll(references) {
    const customers = this._Customer.query();

    return this._withReferences(customers, references).fetch();
  }

  getById(customer_id, references) {
    const customer = this._Customer.query();

    return this._withReferences(customer, references)
      .where({ customer_id })
      .fetch()
      .then((response) => response.first());
  }

  async create(attributes, references) {
    const { customer_id } = await this._Customer.create(attributes);

    const customer = this._Customer.query();

    return this._withReferences(customer, references)
      .where({ customer_id })
      .fetch()
      .then((response) => response.first());
  }

  async updateById(customer_id, attributes, references) {
    let customer = await this._Customer.find(customer_id);

    customer.merge(attributes);

    await customer.save();

    customer = this._Customer.query();

    return this._withReferences(customer, references)
      .where({ customer_id })
      .fetch()
      .then((response) => response.first());
  }

  async deleteById(customer_id) {
    const customer = await this._Customer.find(customer_id);

    return customer.delete();
  }
}
