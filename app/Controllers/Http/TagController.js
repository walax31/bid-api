'use strict'

const makeTagUtil = require('../../../util/tagUtil.func')

const TagModel = use('App/Models/Tag')

class TagController {
  async index ({ request }) {
    const { references, page, per_page } = request.qs

    const { rows, pages } = await makeTagUtil(TagModel).getAll(
      references,
      page,
      per_page
    )

    return {
      status: 200,
      error: undefined,
      pages,
      data: rows
    }
  }

  async show ({ request }) {
    const { params, qs } = request

    const { id } = params

    const { references } = qs

    const tag = await makeTagUtil(TagModel).getById(id, references)

    return {
      status: 200,
      error: undefined,
      data: tag || {}
    }
  }

  async store ({ request }) {
    const { body, qs } = request

    const { tag_name } = body

    const { references } = qs

    const tag = await makeTagUtil(TagModel).create({ tag_name }, references)

    return {
      status: 200,
      error: undefined,
      data: tag
    }
  }

  async getTagSort ({ request, response }) {
    const { limit = 10 } = request.qs

    const tags = await TagModel.query()
      .withCount('products as products')
      .fetch()
      .then(query => query.toJSON())

    const sortedTags = await tags
      // eslint-disable-next-line
      .sort((a, b) => b.__meta__.products.length - a.__meta__.products.length)
      .slice(0, limit)

    return response.send({
      status: 200,
      error: undefined,
      data: sortedTags.map(sortedTag => sortedTag.tag_name)
    })
  }

  async update ({ request }) {
    const { body, params, qs } = request

    const { id } = params

    const { references } = qs

    const { tag_name } = body

    const tag = await makeTagUtil(TagModel).updateById(
      id,
      { tag_name },
      references
    )

    return {
      status: 200,
      error: undefined,
      data: tag
    }
  }

  async destroy ({ request }) {
    const { id } = request.params

    const tag = await makeTagUtil(TagModel).deleteById(id)

    return {
      status: 200,
      error: undefined,
      data: { message: `${tag} is successfully removed.` }
    }
  }
}

module.exports = TagController
