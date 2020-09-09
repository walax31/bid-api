const Validator = use("Validator");

module.exports = async function (data) {
  if (typeof data !== "object") throw new Error("Param does is not an object.");

  const {
    first_name,
    last_name,
    address,
    phone,
    path_to_credential,
    customer_id,
  } = data;

  const rules = {
    first_name: "required",
    last_name: "required",
    address: "required",
    phone: "required|unique:users,phone|min:10",
    path_to_credential: "required",
    customer_id: "required",
  };

  const validation = await Validator.validateAll(
    {
      first_name,
      last_name,
      address,
      phone,
      path_to_credential,
      customer_id,
    },
    rules
  );

  return { error: validation.messages() };
};
