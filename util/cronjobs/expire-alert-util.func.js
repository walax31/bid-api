module.exports = async function expireAlertUtil (
  CronModel,
  CronUtil,
  cron_uuid,
  AlertModel,
  AlertUtil,
  alert,
  broadcastAlert,
  Ws
) {
  await AlertUtil(AlertModel)
    .updateById(alert.uuid, { is_expired: true })
    // eslint-disable-next-line
    .then((response) => console.log(response.toJSON()))
    // eslint-disable-next-line
    .catch((e) => console.log(e))
    .finally(async () => {
      await CronUtil(CronModel).updateById(cron_uuid, { job_active: false })

      broadcastAlert(Ws, alert.user_uuid, 'remove:alert', alert)

      global.CronJobManager.deleteJob(cron_uuid)
    })
}
