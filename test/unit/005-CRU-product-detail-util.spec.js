"use strict";

const { test } = use("Test/Suite")("CRU Product Detail Util");
const makeProductDetailUtil = require("../../util/ProductDetailUtil.func");
const ProductDetailModel = use("App/Models/ProductDetail");

test("should return empty array of rows from makeProductDetailUtil", async ({
  assert,
}) => {
  const testSubject = await makeProductDetailUtil(ProductDetailModel).getAll(
    ""
  );

  assert.equal(testSubject.rows.length, 0);
});

test("should return object of created index from makeProductDetailUtil.", async ({
  assert,
}) => {
  const testSubject = await makeProductDetailUtil(ProductDetailModel).create({
    product_id: 1,
    product_price: 1000,
    product_bid_start: 100,
    product_bid_increment: 100,
    product_description: "a_product_description",
  });

  assert.isOk(testSubject);
});

test("should return array of row from makeProductDetailUtil.", async ({
  assert,
}) => {
  const testSubject = await makeProductDetailUtil(ProductDetailModel).getAll(
    ""
  );

  assert.isArray(testSubject.rows);
});

test("should return object of requested created index from makeProductDetailUtil.", async ({
  assert,
}) => {
  const testSubject = await makeProductDetailUtil(ProductDetailModel).getById(
    1,
    ""
  );

  assert.isOk(testSubject);
});

test("should return modified object of updated index form makeProductDetailUtil.", async ({
  assert,
}) => {
  const testSubject = await makeProductDetailUtil(
    ProductDetailModel
  ).updateById(1, { product_description: "a_new_product_description" }, "");

  assert.equal(
    testSubject["$attributes"].product_description,
    "a_new_product_description"
  );
});
