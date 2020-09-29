module.exports = async function (Drive, rows) {
  const new_rows = await rows.map(async (row) => {
    const {
      uuid,
      product_name,
      customer_uuid,
      end_date,
      stock,
      is_biddable,
      product_image,
    } = row;

    if (product_image)
      return {
        uuid,
        product_name,
        customer_uuid,
        end_date,
        stock,
        product_image: product_image
          ? await Drive.disk("s3").getSignedUrl(product_image)
          : undefined,
        is_biddable,
        customer: row.getRelated("customer"),
        productDetail: row.getRelated("productDetail"),
        bids: row.getRelated("bids"),
        order: order.getRelated("order"),
        credentialRating: row.getRelated("credentialRating"),
      };

    return row;
  });

  return new_rows;
};
