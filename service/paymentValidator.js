const Validator = use("Validator");

module.exports = async function (data) {
  if (typeof data !== "object") throw new Error("Param dones is not a object.");

  const { method, status, total } = data;

  const rules = {
    method: "required",
    total: "required",
  };

  const validation = await Validator.validateAll(
    {
      method,
      total,
    },
    rules
  );

  return { error: validation.messages() };
};
