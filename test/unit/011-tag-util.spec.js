'use strict'

const makeTagUtil = require('../../util/tagUtil.func')
const makeTestTagUtil = require('../../util/testerUtil/autogenTagInstance.func')

const { test } = use('Test/Suite')('Tag Util')
const TagModel = use('App/Models/Tag')

/* Test cases
 * 1. getAll. (empty)
 * 2. getById.
 * 3. getAll.
 * 4. create.
 * 5. updateById.
 * 6. deleteById.
 * */

// 1. getAll. (empty)
test('should return empty array of rows from makeTagUtil.', async ({ assert }) => {
  const tags = await makeTagUtil(TagModel).getAll('')

  assert.equal(tags.rows.length, 0)
})

// 2. getById.
test('should return index of created object from makeTagUtil.', async ({ assert }) => {
  const { uuid, tag_name } = await makeTagUtil(TagModel)
    .create({ tag_name: 'tag_name' })
    .then(response => response.toJSON())

  assert.equal(tag_name, 'tag_name')

  await TagModel.find(uuid).then(query => query.delete())
})

// 3. getAll.
test('should return array of rows from makeTagUtil.', async ({ assert }) => {
  const { uuid } = await makeTestTagUtil(TagModel)

  const tag = await makeTagUtil(TagModel).getAll('')

  assert.isAbove(tag.rows.length, 0)

  await TagModel.find(uuid).then(query => query.delete())
})

// 4. create.
test('should return index of created object from makeTagUtil.', async ({ assert }) => {
  const { uuid } = await makeTestTagUtil(TagModel)

  const tag = await makeTagUtil(TagModel).getById(uuid, '')

  assert.isOk(tag)

  await TagModel.find(uuid).then(query => query.delete())
})

// 5. updateById.
test('should return index of modified object from makeTagUtil.', async ({ assert }) => {
  const { uuid } = await makeTestTagUtil(TagModel)

  const { tag_name } = await makeTagUtil(TagModel)
    .updateById(uuid, { tag_name: 'new_tag_name' })
    .then(response => response.toJSON())

  assert.equal(tag_name, 'new_tag_name')

  await TagModel.find(uuid).then(query => query.delete())
})

// 6. deleteById.
test('should return index of deleted object from makeTagUtil.', async ({ assert }) => {
  const { uuid } = await makeTestTagUtil(TagModel)

  const deletedTag = await makeTagUtil(TagModel).deleteById(uuid)

  assert.isOk(deletedTag)
})
