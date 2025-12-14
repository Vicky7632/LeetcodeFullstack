const validator=require("validator");
const validate=(data)=>{
    const mandatoryField=['firstName','emailId','password'];
    const IsAllowed=mandatoryField.every((k)=>Object.keys(data).includes(k));
    if(!IsAllowed)
        throw new Error("Some Field Missing");
    if(!validator.isEmail(data.emailId))
        throw new Error("Invaild Email");
    if(!validator.isStrongPassword(data.password))
        throw new Error("Week Password");
    //also check for minimum length
}
module.exports=validate;
