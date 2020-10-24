module.exports = function assignTokenUtil (
  dependenciesList,
  cronjobReferences,
  cronjobDate,
  cron_uuid,
  cronjobTask
) {
  const { order_quantity } = cronjobReferences
  const {
    CronModel,
    makeCronUtil,
    OrderModel,
    makeOrderUtil,
    ProductModel,
    makeProductUtil,
    CustomerModel,
    makeCustomerUtil,
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
          OrderModel,
          makeOrderUtil,
          ProductModel,
          makeProductUtil,
          CustomerModel,
          makeCustomerUtil,
          order_quantity
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
          OrderModel,
          makeOrderUtil,
          ProductModel,
          makeProductUtil,
          CustomerModel,
          makeCustomerUtil,
          order_quantity
        ),
      {
        start: true,
        timeZone: 'Asia/Bangkok'
      }
    )
  }
}
