const Validator = use("Validator");

module.exports = async function (data) {
  if (typeof data !== "object") throw new Error("Param dones is not a object.");

  const { method, status, total, uuid } = data;

  const rules = {
    method: "required",
    total: "required",
    uuid: "required",
  };

  const validation = await Validator.validateAll(
    {
      method,
      total,
      uuid,
    },
    rules
  );

  return { error: validation.messages() };
};
