'use strict'

const Address = use('App/Models/Address')

const makeAddressUtil = require('../../../util/addressUtil.func')

class AddressController {
  async index ({ request }) {
    const { references, page, per_page } = request.qs

    const { rows, pages } = await makeAddressUtil(Address).getAll(
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

    const address = await makeAddressUtil(Address).getById(id, references)

    return {
      status: 200,
      error: undefined,
      data: address || {}
    }
  }

  async store ({ request }) {
    const { body, qs, customer_uuid } = request

    const {
      phone,
      building,
      road,
      city,
      sub_city,
      province,
      postal_code
    } = body

    const { references } = qs

    const address = await makeAddressUtil(Address).create(
      {
        phone,
        building,
        road,
        city,
        sub_city,
        province,
        postal_code,
        customer_uuid
      },
      references
    )

    return {
      status: 200,
      error: undefined,
      data: address
    }
  }

  async update ({ request }) {
    const { body, params, qs, customer_uuid } = request

    const { id } = params

    const { references } = qs

    const {
      phone,
      building,
      road,
      city,
      sub_city,
      province,
      postal_code
    } = body

    const address = await makeAddressUtil(Address).getById(
      id,
      '',
      customer_uuid
    )

    if (!address) {
      return {
        status: 404,
        error: 'Address not found. Could not find your existing address.',
        data: undefined
      }
    }

    const data = await makeAddressUtil(Address).updateById(
      id,
      {
        phone,
        building,
        road,
        city,
        sub_city,
        province,
        postal_code
      },
      references
    )

    return {
      status: 200,
      error: undefined,
      data
    }
  }

  async destroy ({ request }) {
    const { id } = request.params

    const existingAddress = await makeAddressUtil(Address).getById(
      id,
      '',
      request.customer_uuid
    )

    if (!existingAddress) {
      return {
        status: 404,
        error:
          'Address not found. address you were looking for does not exist.',
        data: undefined
      }
    }

    await makeAddressUtil(Address).deleteById(id)

    return {
      status: 200,
      error: undefined,
      data: { message: `Address ${id} was successfully removed.` }
    }
  }
}

module.exports = AddressController
