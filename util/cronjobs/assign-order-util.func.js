module.exports = async function assignOrderUtil (
  CronModel,
  CronUtil,
  cron_uuid,
  OrderModel,
  OrderUtil,
  ProductModel,
  ProductUtil,
  CustomerModel,
  CustomerUtil,
  order_quantity
) {
  const { content: product_uuid } = await CronUtil(CronModel)
    .getById(cron_uuid)
    .then(query => query.toJSON())

  // eslint-disable-next-line
  const existingBidOnYourProduct = await ProductUtil(ProductModel)
    .findExistingBidOnThisProduct(product_uuid)
    .then(query => query.toJSON())

  if (!existingBidOnYourProduct.length) {
    // eslint-disable-next-line
    console.log({
      status: 404,
      error: 'Bid not found. customer(s) never bid on your product.',
      data: undefined
    })
    await CronUtil(CronModel).updateById(cron_uuid, { job_active: false })

    global.CronJobManager.deleteJob(cron_uuid)
    return
  }

  const sortedBid = existingBidOnYourProduct.sort((a, b) => b.bid_amount - a.bid_amount)

  const { customer_uuid, uuid: bid_uuid } = sortedBid[0]

  // eslint-disable-next-line
  const existingOrderOnThisCustomer = await CustomerUtil(
    CustomerModel).findExistingOrder(customer_uuid, product_uuid)

  if (existingOrderOnThisCustomer) {
    // eslint-disable-next-line
    console.log({
      status: 500,
      error:
        'Duplicate order. order on this specific user has already existed.',
      data: undefined
    })
    await CronUtil(CronModel).updateById(cron_uuid, { job_active: false })

    global.CronJobManager.deleteJob(cron_uuid)
    return
  }

  await OrderUtil(OrderModel)
    .create({ customer_uuid, product_uuid, order_quantity, bid_uuid })
    .catch(e =>
      // eslint-disable-next-line
      console.log(`Error
  detected while processing order. Error: ${e}`))
    .finally(async () => {
      await CronUtil(CronModel).updateById(cron_uuid, { job_active: false })

      global.CronJobManager.deleteJob(cron_uuid)
    })
}
