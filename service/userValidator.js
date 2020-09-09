const Validator =use(Validator)
module.exports =async function(data){
    if(typeof data !=="object") throw new Error("Param dones is not a object.")
   
    const {username,email,password}
    const rule={
        username:"require",
        email:"require",
        pessword:"require"
    }
    const validation= await Validator.validateAll({
        username,email,password
    },rule)
    return {error: validation.messages()}
}