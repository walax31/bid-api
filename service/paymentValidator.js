const Validator = use("Validator");

module.exports = async function (data) {
  if (typeof data !== "object") throw new Error("Param dones is not a object.");

  const { method, status, total, order_id } = data;

  const rules = {
    method: "required",
    total: "required",
    order_id: "required",
  };

  const validation = await Validator.validateAll(
    {
      method,
      total,
      order_id,
    },
    rules
  );

  return { error: validation.messages() };
};
