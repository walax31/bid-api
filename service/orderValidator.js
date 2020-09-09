const Validator = use("Validator");

module.exports = async function (data) {
  if (typeof data !== "object") throw new Error("Param donse is not an object");

  const { customer_id } = data;

  const rule = {
    customer_id: "required",
  };

  const validation = await Validator.validateAll({ customer_id }, rule);

  return { error: validation.messages() };
};
