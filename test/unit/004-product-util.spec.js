"use strict";

const { test } = use("Test/Suite")("Product Util");
const ProductModel = use("App/Models/Product");
const CustomerModel = use("App/Models/Customer");
const UserModel = use("App/Models/User");
const makeUserUtil = require("../../util/testerUtil/autogenUserInstance.func");
const makeCustomerUtil = require("../../util/testerUtil/autogenCustomerInstance.func");
const makeProductUtil = require("../../util/ProductUtil.func");

const sessionData = {};

test("should return empty array of rows from makeProductUtil", async ({
  assert,
}) => {
  const products = await makeProductUtil(ProductModel).getAll("");

  assert.equal(products.rows.length, 0);
});

test("should return object of created index from makeProductUtil.", async ({
  assert,
}) => {
  const { user_id } = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id);

  const product = await makeProductUtil(ProductModel).create({
    customer_id,
    product_name: "product_name",
    stock: 10,
  });

  const { product_id } = product["$attributes"];

  assert.isOk(product_id);

  sessionData.product_id = product_id;
  sessionData.user_id = user_id;
});

test("should return array of row from makeProductUtil.", async ({ assert }) => {
  const products = await makeProductUtil(ProductModel).getAll("");

  assert.isAbove(products.rows.length, 0);
});

test("should return object of requested created index from makeProductUtil.", async ({
  assert,
}) => {
  const product = await makeProductUtil(ProductModel).getById(
    sessionData.product_id,
    ""
  );

  assert.isOk(product);
});

test("should return modified object of updated index form makeProductUtil.", async ({
  assert,
}) => {
  const product = await makeProductUtil(ProductModel).updateById(
    sessionData.product_id,
    { stock: 20 },
    ""
  );

  assert.equal(product["$attributes"].stock, 20);
});

test("should return index of deleted index from makeProductUtil.", async ({
  assert,
}) => {
  assert.plan(2);

  const deletedProduct = await makeProductUtil(ProductModel).deleteById(
    sessionData.product_id
  );

  assert.isOk(deletedProduct);

  const deletedUser = await UserModel.find(
    sessionData.user_id
  ).then((response) => response.delete());

  assert.isOk(deletedUser);
});

test("should not return object of requested index from makeProductUtil.", async ({
  assert,
}) => {
  const product = await makeProductUtil(ProductModel).getById(
    sessionData.product_id,
    ""
  );

  assert.isNotOk(product);
});
