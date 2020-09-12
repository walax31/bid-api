const Helpers = use("Helpers");

module.exports = async function (credentialImage, username) {
  const fileName = `${new Date().getTime()}-${username}`;

  await credentialImage.move(Helpers.tmpPath("uploads"), {
    name: `${fileName}.jpg`,
    overwrite: true,
  });

  if (!credentialImage.moved()) {
    return { error: credentialImage.error() };
  }

  return { data: fileName };
};
