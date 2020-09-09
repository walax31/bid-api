"use strict";

const { test } = use("Test/Suite")("D Product Util");
const makeProductUtil = require("../../util/ProductUtil.func");
const ProductModel = use("App/Models/Product");

test("should return index of deleted index from makeProductUtil.", async ({
  assert,
}) => {
  const testSubject = await makeProductUtil(ProductModel).deleteById(1);

  assert.isOk(testSubject);
});

test("should not return object of requested index from makeProductUtil.", async ({
  assert,
}) => {
  const testSubject = await makeProductUtil(ProductModel).getById(1, "");

  assert.isNotOk(testSubject);
});
