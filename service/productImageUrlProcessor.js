module.exports = async function (Drive, rows) {
  const new_rows = await rows.map(async (row) => {
    const {
      product_id,
      product_name,
      customer_id,
      end_date,
      stock,
      is_bidable,
      product_image,
    } = row;

    if (product_image)
      return {
        product_id,
        product_name,
        customer_id,
        end_date,
        stock,
        product_image: product_image
          ? await Drive.disk("s3").getSignedUrl(product_image)
          : undefined,
        is_bidable,
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
