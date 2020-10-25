'use strict'

/*
|--------------------------------------------------------------------------
| DatabaseSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
// const Factory = use('Factory')
// const returnArrayWithIterable = require('../../util/returnArrayWithIterable.func')
// seederUtil dependencies
// const makeUsers = require('../../util/seederUtil/userSeederUtil.func')
// const makeCustomers = require('../../util/seederUtil/customerSeederUtil.func')
// const makeRatings = require('../../util/seederUtil/ratingSeederUtil.func')
// const makeProducts = require('../../util/seederUtil/productSeederUtil.func')
// const makeProductDetails = require('../../util/seederUtil/productDetailSeederUtil.func')
// const makeBids = require('../../util/seederUtil/bidSeederUtil.func')
// const makeOrders = require('../../util/seederUtil/orderSeederUtil.func')
// const makeOrderDetails = require("../../util/seederUtil/orderDetailSeederUtil.func");
// const makePayments = require('../../util/seederUtil/paymentSeederUtil.func')

class DatabaseSeeder {
  async run () {
    // const users = await makeUsers(10, Factory)
    // const customers = await makeCustomers(10, Factory)
    // let counter = 0
    // for (const user of users) {
    //   await user.customer().save(customers[counter])
    //   counter++
    // }
    // const ratings = await makeRatings(20, Factory)
    // counter = 0
    // const ratingPerIteration = 2
    // for (const customer of customers) {
    //   const selectedRating = ratings.slice(
    //     counter,
    //     counter + ratingPerIteration
    //   )
    //   await customer.credentialRatings().saveMany(selectedRating)
    //   counter += ratingPerIteration
    // }
    // const products = await makeProducts(20, Factory)
    // counter = 0
    // const productPerIteration = 2
    // for (const customer of customers) {
    //   const selectedProducts = products.slice(
    //     counter,
    //     counter + productPerIteration
    //   )
    //   await customer.products().saveMany(selectedProducts)
    //   counter += productPerIteration
    // }
    // const productDetails = await makeProductDetails(20, Factory)
    // counter = 0
    // for (const product of products) {
    //   await product.productDetail().save(productDetails[counter])
    //   counter++
    // }
    // const bids = await makeBids(40, Factory, returnArrayWithIterable(1, 4, 40))
    // counter = 0
    // const bidPerIteration = 2
    // for (const product of products) {
    //   const selectedBids = bids.slice(counter, counter + bidPerIteration)
    //   await product.bids().saveMany(selectedBids)
    //   counter += bidPerIteration
    // }
    // // counter = 0;
    // // const userBidPerIteration = 4;
    // // for (const customer of customers) {
    // //   const selectedBids = bids.slice(counter, counter + userBidPerIteration);
    // //   await customer.bids().saveMany(selectedBids);
    // //   counter += userBidPerIteration;
    // // }
    // const orders = await makeOrders(
    //   20,
    //   Factory,
    //   returnArrayWithIterable(1, 2, 20)
    // )
    // // counter = 0;
    // // for (const customer of customers) {
    // //   await customer.orders().save(orders[counter]);
    // //   counter++;
    // // }
    // const orderDetails = await makeOrderDetails(
    //   20,
    //   Factory,
    //   returnArrayWithIterable(1, 1, 20)
    // )
    // counter = 0
    // for (const order of orders) {
    //   await order.orderDetails().save(orderDetails[counter])
    //   counter++
    // }
    // const payments = await makePayments(20, Factory)
    // counter = 0
    // for (const order of orders) {
    //   await order.payment().save(payments[counter])
    //   counter++
    // }
  }
}

module.exports = DatabaseSeeder
