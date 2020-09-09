const Validator =use(Validator)
module.exports =async function(data){
    if(typeof data !=="object") throw new Error("Param dones is not a object.")
   
    const {product_id,order_quantity,order_id}
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