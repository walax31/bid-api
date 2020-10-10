module.exports = async function (
  // CronJob,
  Encryption,
  TokenModel,
  CronModel,
  CronUtil,
  uuid,
  refreshToken
  // timeInMinutes
) {
  const decryptedToken = await Encryption.decrypt(refreshToken);

  await TokenModel.query()
    .where({ token: decryptedToken })
    .fetch()
    .then(async (response) => {
      const { token_id } = response.first().toJSON();

      await TokenModel.find(token_id)
        .then(async (response) => {
          response.merge({ is_revoked: true });

          await response.save();
        })
        .catch((e) => console.log(e));

      console.log(`${refreshToken} is revoked at ${new Date()}.`);
    })
    .catch((e) =>
      console.log(
        `Error detected when trying to revoke token. Token: ${refreshToken}. Error: ${e}`
      )
    )
    .finally(async () => {
      await CronUtil(CronModel).updateById(uuid, { job_active: false });

      global.CronJobManager.deleteJob(uuid);
    });
  // return new CronJob(
  //   new Date(new Date().setMinutes(new Date().getMinutes() + timeInMinutes)),
  //   async function () {
  //     const decryptedToken = await Encryption.decrypt(refreshToken);

  //     await TokenModel.query()
  //       .where({ token: decryptedToken })
  //       .fetch()
  //       .then(async (response) => {
  //         const { token_id } = response.first().toJSON();

  //         await TokenModel.find(token_id)
  //           .then(async (response) => {
  //             response.merge({ is_revoked: true });

  //             await response.save();
  //           })
  //           .catch((e) => console.log(e));

  //         console.log(`${refreshToken} is revoked at ${new Date()}.`);
  //       })
  //       .catch((e) =>
  //         console.log(
  //           `Error detected when trying to revoke token. Token: ${refreshToken}. Error: ${e}`
  //         )
  //       )
  //       .finally(() => this.stop());
  //   },
  //   null,
  //   true,
  //   "Asia/Bangkok"
  // );
};
