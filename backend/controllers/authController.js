import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function login(req, res) {
 const { name, password } = req.body;

 try {


        if(!name || !password){
            return res.status(400).json( {message: "Both fields are required"} );
        }

        const existingUser=await User.findOne({name});

        if(!existingUser){
            return res.status(401).json( {message : "User does not exists"} );
        }

        if(existingUser.password==="20240437"){
            existingUser.password=password;
            await existingUser.save();
        }

        const passwordMatches=await bcrypt.compare(password , existingUser.password);
        if(!passwordMatches){
            return res.status(401).json( {message : "Invalid Password"} );
        }
        const accessToken=jwt.sign({userID:existingUser._id},process.env.ACCESS_TOKEN_SECRET,{
            expiresIn:"20d"
        }); 

        //adding accessToken to cookie
            res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure:true,
            sameSite: 'Strict', 
            maxAge: 20 * 24 * 60 * 60 * 1000 
        });
        
        res.status(200).json({ success: true, user: existingUser });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }

}

export async function logout(req, res) {
  res.clearCookie("accessToken");
  res.status(200).json( {message: "Logout Successful"} )
}

