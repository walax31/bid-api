module.exports = function (BidModels,customer_id,product_id) {
    return BidModels.create({
     
     customer_id,
     bid_amount:1000,
     product_id

    }).then((response) => response["$attributes"]);
  };
  