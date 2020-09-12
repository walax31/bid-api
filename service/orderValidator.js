const Validator = use("Validator");

module.exports = async function (data) {
  if (typeof data !== "object") throw new Error("Param donse is not an object");

  const { customer_id, product_id, order_quantity } = data;

  const rule = {
    customer_id: "required",
    product_id: "required",
    order_quantity: "required",
  };

  const validation = await Validator.validateAll(
    { customer_id, product_id, order_quantity },
    rule
  );

  return { error: validation.messages() };
};
