const Validator = use("Validator");

module.exports = async function (data) {
  if (typeof data !== "object") throw new Error("Param does is not an object.");

  const { customer_id, rating_score, rating_description } = data;

  const rules = {
    customer_id: "required|unique:customers,customer_id",
    rating_score: "required",
    rating_description: "required",
  };

  const validation = await Validator.validateAll(
    { customer_id, rating_score, rating_description },
    rules
  );

  return { error: validation.messages() };
};
