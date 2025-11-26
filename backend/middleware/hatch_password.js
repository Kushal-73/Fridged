import bcrypt from "bcryptjs";

async function hatch_pass(next){
    const user=this;
    if(!user.isModified("password")){
        return next();
    }
    try{
        const salt=await bcrypt.genSalt(10);
        user.password=await bcrypt.hash(user.password,salt);
        next();

    }catch(error){      
        next(error);
    }
}

export default hatch_pass;