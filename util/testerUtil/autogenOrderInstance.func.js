module.exports = function (OrderModel, customer_id,product_id) {
  return OrderModel.create({
     customer_id,
     product_id,
     order_quantity:10,
    
    
    }).then(
    (response) => response["$attributes"]
  );
};
