const Validator = use("Validator");

module.exports = async function (data) {
  if (typeof data !== "object") throw new Error("Param does is not an object.");

  const { username, password, email } = data;

  const rules = {
    username: "require|unique:users,username",
    password: "require|min:8",
    email: "require|email|unique:users,email",
  };

  const validation = await Validator.validateAll(
    { username, password, email },
    rules
  );

  return { error: validation.messages() };
};
