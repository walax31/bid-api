const Validator = use("Validator");

module.exports = async function (data) {
  if (typeof data !== "object") throw new Error("Param does is not an object.");

  const {
    product_price,
    product_bid_start,
    product_bid_increment,
    product_description,
  } = data;

  const rules = {
    product_price: "required",
    product_bid_start: "required",
    product_bid_increment: "required",
    product_description: "required",
  };

  const validation = await Validator.validateAll(
    {
      product_price,
      product_bid_start,
      product_bid_increment,
      product_description,
    },
    rules
  );

  return { error: validation.messages() };
};
