module.exports = function autogenUserInstance (UserModel, is_submitted = false) {
  return UserModel.create({
    username: 'username',
    password: 'password',
    email: 'example@domain.host',
    is_submitted
  }).then(response => response.toJSON())
}
