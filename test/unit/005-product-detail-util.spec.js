"use strict";

const { test } = use("Test/Suite")("Product Detail Util");
const ProductDetailModel = use("App/Models/ProductDetail");
const ProductModel = use("App/Models/Product");
const CustomerModel = use("App/Models/Customer");
const UserModel = use("App/Models/User");
const makeUserUtil = require("../../util/testerUtil/autogenUserInstance.func");
const makeCustomerUtil = require("../../util/testerUtil/autogenCustomerInstance.func");
const makeProductUtil = require("../../util/testerUtil/autogenProductInstance.func");
const makeProductDetailUtil = require("../../util/ProductDetailUtil.func");

const sessionData = {};

test("should return empty array of rows from makeProductDetailUtil", async ({
  assert,
}) => {
  const productDetails = await makeProductDetailUtil(ProductDetailModel).getAll(
    ""
  );

  assert.equal(productDetails.rows.length, 0);
});

test("should return object of created index from makeProductDetailUtil.", async ({
  assert,
}) => {
  const { user_id } = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id);

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  const productDetail = await makeProductDetailUtil(ProductDetailModel).create({
    product_id,
    product_price: 1000,
    product_bid_start: 100,
    product_bid_increment: 100,
    product_description: "a_product_description",
  });

  assert.isOk(productDetail);

  sessionData.product_id = product_id;
  sessionData.user_id = user_id;
});

test("should return array of row from makeProductDetailUtil.", async ({
  assert,
}) => {
  const productDetails = await makeProductDetailUtil(ProductDetailModel).getAll(
    ""
  );

  assert.isAbove(productDetails.rows.length, 0);
});

test("should return object of requested created index from makeProductDetailUtil.", async ({
  assert,
}) => {
  const productDetail = await makeProductDetailUtil(ProductDetailModel).getById(
    sessionData.product_id,
    ""
  );

  assert.isOk(productDetail);
});

test("should return modified object of updated index form makeProductDetailUtil.", async ({
  assert,
}) => {
  const productDetail = await makeProductDetailUtil(
    ProductDetailModel
  ).updateById(
    sessionData.product_id,
    { product_description: "a_new_product_description" },
    ""
  );

  assert.equal(
    productDetail["$attributes"].product_description,
    "a_new_product_description"
  );
});

test("should return index of deleted index from makeProductDetailUtil.", async ({
  assert,
}) => {
  assert.plan(2);

  const deletedProductDetail = await makeProductDetailUtil(
    ProductDetailModel
  ).deleteById(sessionData.product_id);

  assert.isOk(deletedProductDetail);

  const deletedUser = await UserModel.find(
    sessionData.user_id
  ).then((response) => response.delete());

  assert.isOk(deletedUser);
});

test("should not return object of requested index from makeProductDetailUtil.", async ({
  assert,
}) => {
  const productDetail = await makeProductDetailUtil(ProductDetailModel).getById(
    sessionData.product_id,
    ""
  );

  assert.isNotOk(productDetail);
});
