'use strict'

const makeTagUtil = require('../../../util/tagUtil.func')

const Tag = use('App/Models/Tag')

class TagController {
  async index ({ request }) {
    const { references, page, per_page } = request.qs

    const { rows, pages } = await makeTagUtil(Tag).getAll(
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

    const tag = await makeTagUtil(Tag).getById(id, references)

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

    const tag = await makeTagUtil(Tag).create({ tag_name }, references)

    return {
      status: 200,
      error: undefined,
      data: tag
    }
  }

  async update ({ request }) {
    const { body, params, qs } = request

    const { id } = params

    const { references } = qs

    const { tag_name } = body

    const tag = await makeTagUtil(Tag).updateById(id, { tag_name }, references)

    return {
      status: 200,
      error: undefined,
      data: tag
    }
  }

  async destroy ({ request }) {
    const { id } = request.params

    const tag = await makeTagUtil(Tag).deleteById(id)

    return {
      status: 200,
      error: undefined,
      data: { message: `${tag} is successfully removed.` }
    }
  }
}

module.exports = TagController
