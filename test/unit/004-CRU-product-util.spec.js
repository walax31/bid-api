"use strict";

const { test } = use("Test/Suite")("CRU Product Util");
const makeProductUtil = require("../../util/ProductUtil.func");
const ProductModel = use("App/Models/Product");

test("should return empty array of rows from makeProductUtil", async ({
  assert,
}) => {
  const testSubject = await makeProductUtil(ProductModel).getAll("");

  assert.equal(testSubject.rows.length, 0);
});

test("should return object of created index from makeProductUtil.", async ({
  assert,
}) => {
  const testSubject = await makeProductUtil(ProductModel).create({
    customer_id: 1,
    product_name: "a_product_name",
    stock: 10,
  });

  assert.isOk(testSubject);
});

test("should return array of row from makeProductUtil.", async ({ assert }) => {
  const testSubject = await makeProductUtil(ProductModel).getAll("");

  assert.isArray(testSubject.rows);
});

test("should return object of requested created index from makeProductUtil.", async ({
  assert,
}) => {
  const testSubject = await makeProductUtil(ProductModel).getById(1, "");

  assert.isOk(testSubject);
});

test("should return modified object of updated index form makeProductUtil.", async ({
  assert,
}) => {
  const testSubject = await makeProductUtil(ProductModel).updateById(
    1,
    { stock: 20 },
    ""
  );

  assert.equal(testSubject["$attributes"].stock, 20);
});
