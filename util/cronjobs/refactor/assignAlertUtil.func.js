module.exports = function assignTokenUtil (
  dependenciesList,
  cronjobReferences,
  cronjobDate,
  cron_uuid,
  cronjobTask
) {
  const { alert } = cronjobReferences
  const {
    CronModel,
    makeCronUtil,
    AlertModel,
    makeAlertUtil,
    broadcastAlert,
    Ws,
    CronJobManager
  } = dependenciesList
  if (!global.CronJobManager) {
    global.CronJobManager = new CronJobManager(
      cron_uuid,
      cronjobDate,
      () =>
        cronjobTask(
          CronModel,
          makeCronUtil,
          cron_uuid,
          AlertModel,
          makeAlertUtil,
          alert,
          broadcastAlert,
          Ws
        ),
      {
        start: true,
        timeZone: 'Asia/Bangkok'
      }
    )
  } else {
    global.CronJobManager.add(
      cron_uuid,
      cronjobDate,
      () =>
        cronjobTask(
          CronModel,
          makeCronUtil,
          cron_uuid,
          AlertModel,
          makeAlertUtil,
          alert,
          broadcastAlert,
          Ws
        ),
      {
        start: true,
        timeZone: 'Asia/Bangkok'
      }
    )
  }
}
