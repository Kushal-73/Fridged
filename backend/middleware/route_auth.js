import jwt from "jsonwebtoken";
import User from "../models/User.js";

async function route_authentication (req,res,next){

    try {
        const accessToken= req.cookies?.accessToken;

        if(!accessToken){
            return res.status(401).json( {message : 'Unauthorized NO TOKEN AVAILABLE'} );
        }

        const decoded= jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        
        if(!decoded){
            return res.status(401).json( {message : 'Unauthorized INVALID TOKEN'} );
        }
        
        const user=await User.findById(decoded.userID).select("-password");

        if(!user){
            return res.status(401).json( {message : 'Unauthorized USER NOT EXIST'} );
        }

        req.user=user;

        next();

    } catch (error) {
        console.log('ERROR IN AUTHENTICATION');
        console.log(error.message);
        res.status(500).json( {message : 'Internal Server Error'} );
    }
}

export default route_authentication;