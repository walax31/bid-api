const Validator = use(Validator);

module.exports = async function (data) {
  if (typeof data !== "object") throw new Error("Param dones is not a object.");

  const { method, status, total } = data;

  const rule = {
    method: "require",
    status: "require",
    total: "require",
  };

  const validation = await Validator.validateAll(
    {
      method,
      status,
      total,
    },
    rule
  );

  return { error: validation.messages() };
};

