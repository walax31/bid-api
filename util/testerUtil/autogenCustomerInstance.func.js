module.exports = function (CustomerModel, user_id) {
  return CustomerModel.create({
    user_id,
    first_name: "first_name",
    last_name: "last_name",
    address: "address",
    phone: "(000) 000-0000",
    path_to_credential: `path/to/credential${user_id}`,
  }).then((response) => response["$attributes"]);
};
