module.exports = function (
  CustomerModel,
  user_uuid,
  is_validated = false,
  is_rejected = false
) {
  return CustomerModel.create({
    user_uuid,
    first_name: "first_name",
    last_name: "last_name",
    path_to_credential: `path/to/credential${user_uuid}`,
    is_validated,
    is_rejected,
  }).then((response) => response.toJSON());
};
