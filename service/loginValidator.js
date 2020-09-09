const Validator = use("Validator");

module.exports = async function (data) {
  if (typeof data !== "object") throw new Error("Param does is not an object.");

  const { username, password, email } = data;

  const rules = {
    username: "required|unique:users,username",
    password: "required|min:8",
    email: "required|email|unique:users,email",
  };

  const validation = await Validator.validateAll(
    { username, password, email },
    rules
  );

  return { error: validation.messages() };
};
