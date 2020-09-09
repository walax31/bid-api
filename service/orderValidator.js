const Validator = use("Validator");

module.exports = async function (data) {
  if (typeof data !== "object") throw new Error("Param donse is not an object");

  const { customer_id } = data;
  const rules = {
    customer_id: "require",
  };

  const validation = await Validator.validateAll({ customer_id }, rules);
  return { error: validation.messages() };
};
