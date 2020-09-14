module.exports = function (
  CronJob,
  Encryption,
  TokenModel,
  refreshToken,
  timeInMinutes
) {
  return new CronJob(
    new Date(new Date().setMinutes(new Date().getMinutes() + timeInMinutes)),
    async function () {
      const decryptedToken = await Encryption.decrypt(refreshToken);

      const { token_id } = await TokenModel.query()
        .where({ token: decryptedToken })
        .fetch()
        .then((response) => response.first()["$attributes"]);

      const token = await TokenModel.find(token_id);

      token.merge({ is_revoked: true });

      await token.save();

      console.log(`${refreshToken} is revoked at ${new Date()}.`);

      this.stop();
    },
    null,
    true,
    "Asia/Bangkok"
  );
};
