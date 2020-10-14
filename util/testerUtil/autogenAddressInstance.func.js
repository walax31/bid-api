module.exports = function autogenAddressInstance (AddressModel, customer_uuid) {
  return AddressModel.create({
    phone: '(000) 000-0000',
    building: 'some building info',
    road: 'example rd.',
    city: 'example city',
    sub_city: 'example sub city',
    province: 'example province',
    postal_code: 'example postal_code',
    customer_uuid
  }).then(response => response.toJSON())
}
