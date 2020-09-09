"use strict";

// const Factory = require("@adonisjs/lucid/src/Factory");
// const { factory } = require("typescript");

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
const Hash = use("Hash");

Factory.blueprint("App/Models/User", async (faker) => {
  return {
    username: faker.username(),
    password: await Hash.make(faker.password()),
    email: faker.email(),
  };
});

Factory.blueprint("App/Models/Customer", (faker) => {
  return {
    first_name: faker.first(),
    last_name: faker.last(),
    address: faker.sentence({ words: 5 }),
    phone: faker.phone(),
    path_to_credential: faker.word({ length: 5 }),
  };
});

Factory.blueprint("App/Models/CredentialRating", (faker) => {
  return {
    rating_score: faker.integer({ max: 2, min: 1 }),
    rating_description: faker.sentence({ words: 5 }),
  };
});

Factory.blueprint("App/Models/Product", (faker) => {
  return {
    product_name: faker.word({ length: 5 }),
    // end_date: faker.integer({ max: 6 }),
    stock: faker.integer({ min: 1, max: 3 }),
  };
});

Factory.blueprint("App/Models/ProductDetail", (faker) => {
  return {
    product_price: faker.integer({ min: 1, max: 5 }),
    product_bid_start: faker.integer({ min: 1, max: 3 }),
    product_bid_increment: faker.integer({ min: 1, max: 2 }),
    product_description: faker.sentence({ words: 5 }),
  };
});

Factory.blueprint("App/Models/Bid", (faker, index, data) => {
  return {
    bid_amount: faker.integer({ min: 1, max: 2 }),
    customer_id: data.customer_id[index],
  };
});

Factory.blueprint("App/Models/Order", (faker, index, data) => {
  return {
    customer_id: data.customer_id[index],
  };
});

Factory.blueprint("App/Models/OrderDetail", (faker, index, data) => {
  return {
    order_quantity: faker.integer({ min: 1, max: 10 }),
    product_id: data.product_id[index],
  };
});

Factory.blueprint("App/Models/Payment", (faker) => {
  return {
    method: faker.word({ length: 3 }),
    status: faker.word({ length: 2 }),
    total: faker.integer({ min: 1, max: 100 }),
  };
});
