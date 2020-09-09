const Validator = use("Validator");

module.exports = async function (data) {
  if (typeof data !== "object") throw new Error("Param does is not an object.");

  const {
    customer_first_name,
    customer_last_name,
    customer_address,
    customer_phone,
    customer_path_to_credential,
    customer_id,
  } = data;

  const rules = {
    customer_first_name: "required",
    customer_last_name: "required",
    customer_address: "required",
    customer_phone: "required|unique:users,customer_phone|min:10",
    customer_path_to_credential: "required",
    customer_id: "required",
  };

  const validation = await Validator.validateAll(
    {
      customer_first_name,
      customer_last_name,
      customer_address,
      customer_phone,
      customer_path_to_credential,
      customer_id,
    },
    rules
  );

  return { error: validation.messages() };
};
