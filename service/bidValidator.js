const Validator = use("Validator");

module.exports = async function (data) {
  if (typeof data !== "object") throw new Error("Param does is not an object.");

  const { customer_uuid, bid_amount, product_uuid } = data;

  const rules = {
    customer_uuid: "required",
    bid_amount: "required",
    product_uuid: "required",
  };

  const validation = await Validator.validateAll(
    { customer_uuid, bid_amount, product_uuid },
    rules
  );

  return { error: validation.messages() };
};
