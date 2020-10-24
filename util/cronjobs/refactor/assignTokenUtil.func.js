module.exports = function assignTokenUtil (
  dependenciesList,
  cronjobReferences,
  cronjobDate,
  cron_uuid,
  cronjobTask
) {
  const { refreshToken } = cronjobReferences
  const {
    Encryption,
    TokenModel,
    CronModel,
    makeCronUtil,
    CronJobManager
  } = dependenciesList
  if (!global.CronJobManager) {
    global.CronJobManager = new CronJobManager(
      cron_uuid,
      cronjobDate,
      () =>
        cronjobTask(
          Encryption,
          TokenModel,
          CronModel,
          makeCronUtil,
          cron_uuid,
          refreshToken
        ),
      {
        start: true,
        timeZone: 'Asia/Bangkok'
      }
    )
  } else if (!global.CronJobManager.exists(cron_uuid)) {
    global.CronJobManager.add(
      cron_uuid,
      cronjobDate,
      () =>
        cronjobTask(
          Encryption,
          TokenModel,
          CronModel,
          makeCronUtil,
          cron_uuid,
          refreshToken
        ),
      {
        start: true,
        timeZone: 'Asia/Bangkok'
      }
    )
  } else {
    global.CronJobManager.update(cron_uuid, cronjobDate, () =>
      cronjobTask(
        Encryption,
        TokenModel,
        CronModel,
        makeCronUtil,
        cron_uuid,
        refreshToken
      ))
  }
}
