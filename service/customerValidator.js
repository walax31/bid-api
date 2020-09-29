const Validator = use("Validator");

module.exports = async function (data) {
  if (typeof data !== "object") throw new Error("Param does is not an object.");

  const {
    first_name,
    last_name,
    // path_to_credential,
    user_uuid,
  } = data;

  const rules = {
    first_name: "required",
    last_name: "required",
    // path_to_credential: "required",
    user_uuid: "required",
  };

  const validation = await Validator.validateAll(
    {
      first_name,
      last_name,
      // path_to_credential,
      user_uuid,
    },
    rules
  );

  return { error: validation.messages() };
};
