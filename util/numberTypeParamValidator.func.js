module.exports = function (number) {
  if (Number.isNaN(parseInt(number))) {
    return {
      error: `param:${number} is not supported, please use number type param instead.`,
    };
  }

  return {};
};
