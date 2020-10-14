module.exports = function autogenAlertInstance (AlertModel, user_uuid) {
  return AlertModel.create({
    user_uuid,
    type: 'bid',
    content: 'Your bid has been overbid by someone.',
    reference: 'product uuid'
  }).then(response => response.toJSON())
}
