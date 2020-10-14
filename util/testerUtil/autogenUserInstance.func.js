module.exports = function autogenUserInstance (UserModel) {
  return UserModel.create({
    username: 'username',
    password: 'password',
    email: 'example@domain.host'
  }).then(response => response.toJSON())
}
