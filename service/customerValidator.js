const Validator = use("Validator");

module.exports = async function (data) {
  if (typeof data !== "object") throw new Error("Param does is not an object.");

  const {
    first_name,
    last_name,
    address,
    phone,
    // path_to_credential,
    user_id,
  } = data;

  const rules = {
    first_name: "required",
    last_name: "required",
    address: "required",
    phone: "required|unique:customers,phone|min:10",
    // path_to_credential: "required",
    user_id: "required",
  };

  const validation = await Validator.validateAll(
    {
      first_name,
      last_name,
      address,
      phone,
      // path_to_credential,
      user_id,
    },
    rules
  );

  return { error: validation.messages() };
};
