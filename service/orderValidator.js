const Validator = use("Validator");

module.exports = async function (data) {
  if (typeof data !== "object") throw new Error("Param donse is not an object");

  const { customer_uuid, product_uuid, order_quantity } = data;

  const rule = {
    customer_uuid: "required",
    product_uuid: "required",
    order_quantity: "required",
  };

  const validation = await Validator.validateAll(
    { customer_uuid, product_uuid, order_quantity },
    rule
  );

  return { error: validation.messages() };
};
