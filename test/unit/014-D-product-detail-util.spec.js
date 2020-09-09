"use strict";

const { test } = use("Test/Suite")("D Product Detail Util");
const makeProductDetailUtil = require("../../util/ProductDetailUtil.func");
const ProductDetailModel = use("App/Models/ProductDetail");

test("should return index of deleted index from makeProductDetailUtil.", async ({
  assert,
}) => {
  const testSubject = await makeProductDetailUtil(
    ProductDetailModel
  ).deleteById(1);

  assert.isOk(testSubject);
});

test("should not return object of requested index from makeProductDetailUtil.", async ({
  assert,
}) => {
  const testSubject = await makeProductDetailUtil(ProductDetailModel).getById(
    1,
    ""
  );

  assert.isNotOk(testSubject);
});
