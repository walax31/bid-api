module.exports = function autogenTagInstance (TagModel) {
  return TagModel.create({ tag_name: 'tag_name' }).then(response =>
    response.toJSON())
}
