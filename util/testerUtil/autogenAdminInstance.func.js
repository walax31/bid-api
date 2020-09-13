module.exports = function (UserModel) {
  return UserModel.create({
    username: "admin",
    password: "password",
    email: "root@domain.host",
    is_admin: true,
  }).then((response) => response["$attributes"]);
};
