const Validator = use("Validator");

module.exports = async function (data) {
  if (typeof data !== "object") throw new Error("Param does is not an object.");

  const { customer_id, bid_amount, product_id } = data;

  const rules = {
    customer_id: "required",
    bid_amount: "required",
    product_id: "required",
  };

  const validation = await Validator.validateAll(
    { customer_id, bid_amount, product_id },
    rules
  );

  return { error: validation.messages() };
};
