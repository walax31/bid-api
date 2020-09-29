module.exports = async function (Drive, rows) {
  const new_rows = await rows.map(async (row) => {
    const {
      user_uuid,
      first_name,
      last_name,
      path_to_credential,
      customer_id,
      uuid,
    } = row;

    if (path_to_credential)
      return {
        user_uuid,
        first_name,
        last_name,
        path_to_credential: path_to_credential
          ? await Drive.disk("s3").getSignedUrl(path_to_credential)
          : undefined,
        customer_id,
        uuid,
        user: row.getRelated("user") || undefined,
        address: row.getRelated("address") || undefined,
      };

    return row;
  });

  return new_rows;
};
