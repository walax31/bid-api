<<<<<<< HEAD
const Validator =use(Validator)
module.exports =async function(data){
    if(typeof data !=="object") throw new Error("Param dones is not a object.")
   
    const {product_id,order_quantity,order_id}=data
    const rule={
        product_id:"require",
        order_quantity:"require",
        order_id:"require"
    }
    const validation= await Validator.validateAll({
        product_id,order_quantity,order_id
    },rule)
    return {error: validation.messages()}
}
=======
const Validator = use("Validator");

module.exports = async function (data) {
  if (typeof data !== "object") throw new Error("Param dones is not a object.");

  const { product_id, order_quantity, order_id } = data;

  const rules = {
    product_id: "require",
    order_quantity: "require",
    order_id: "require",
  };

  const validation = await Validator.validateAll(
    {
      product_id,
      order_quantity,
      order_id,
    },
    rules
  );

  return { error: validation.messages() };
};

>>>>>>> 98147c566d0545d7e7b6879c8024e43fd03cf3fe
