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

  await UserModel.find(user_id).then((response) => response.delete());
});

test("should return array of row from makeProductDetailUtil.", async ({
  assert,
}) => {
  const { user_id } = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id);

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  await ProductDetailModel.create({
    product_id,
    product_price: 1000,
    product_bid_start: 500,
    product_bid_increment: 100,
    product_description: "a_product_description",
  });

  const productDetails = await makeProductDetailUtil(ProductDetailModel).getAll(
    ""
  );

  assert.isAbove(productDetails.rows.length, 0);

  await UserModel.find(user_id).then((response) => response.delete());
});

test("should return object of requested created index from makeProductDetailUtil.", async ({
  assert,
}) => {
  const { user_id } = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id);

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  await ProductDetailModel.create({
    product_id,
    product_price: 1000,
    product_bid_start: 500,
    product_bid_increment: 100,
    product_description: "a_product_description",
  });

  const productDetail = await makeProductDetailUtil(ProductDetailModel).getById(
    product_id,
    ""
  );

  assert.isOk(productDetail);

  await UserModel.find(user_id).then((response) => response.delete());
});

test("should return modified object of updated index form makeProductDetailUtil.", async ({
  assert,
}) => {
  const { user_id } = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id);

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  await ProductDetailModel.create({
    product_id,
    product_price: 1000,
    product_bid_start: 500,
    product_bid_increment: 100,
    product_description: "a_product_description",
  });

  const { product_description } = await makeProductDetailUtil(
    ProductDetailModel
  )
    .updateById(
      product_id,
      { product_description: "a_new_product_description" },
      ""
    )
    .then((response) => response["$attributes"]);

  assert.equal(product_description, "a_new_product_description");

  await UserModel.find(user_id).then((response) => response.delete());
});

test("should return index of deleted index from makeProductDetailUtil.", async ({
  assert,
}) => {
  const { user_id } = await makeUserUtil(UserModel);

  const { customer_id } = await makeCustomerUtil(CustomerModel, user_id);

  const { product_id } = await makeProductUtil(ProductModel, customer_id);

  await ProductDetailModel.create({
    product_id,
    product_price: 1000,
    product_bid_start: 500,
    product_bid_increment: 100,
    product_description: "a_product_description",
  });

  const deletedProductDetail = await makeProductDetailUtil(
    ProductDetailModel
  ).deleteById(product_id);

  assert.isOk(deletedProductDetail);

  await UserModel.find(user_id).then((response) => response.delete());
});