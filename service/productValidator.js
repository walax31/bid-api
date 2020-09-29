const Validator = use("Validator");

module.exports = async function (data) {
  if (typeof data !== "object") throw new Error("Param does is not an object.");

  const { customer_uuid, product_name, end_date, stock } = data;

  const rules = {
    customer_uuid: "required",
    product_name: "required",
    stock: "required",
  };

  const validation = await Validator.validateAll(
    { customer_uuid, product_name, end_date, stock },
    rules
  );

  return { error: validation.messages() };
};
