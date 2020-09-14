module.exports = async function (Drive, rows) {
  const new_rows = await rows.map(async (row) => {
    const {
      user_id,
      first_name,
      last_name,
      address,
      phone,
      path_to_credential,
      customer_id,
    } = row;

    if (path_to_credential)
      return {
        user_id,
        first_name,
        last_name,
        address,
        phone,
        path_to_credential: path_to_credential
          ? await Drive.disk("s3").getSignedUrl(path_to_credential)
          : undefined,
        customer_id,
        user: row.getRelated("user"),
        tokens: row.getRelated("tokens"),
      };

    return row;
  });

  return new_rows;
};
