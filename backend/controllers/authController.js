import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function signup (req,res){
   let {name,password,room}=req.body;
    try {
        name=name.trim();
        //validations code
        if( !name || !password || !room){
            return res.status(400).json( {message: "All fieds are required , retry" } );
        }
        if( password.length < 6){
            return res.status(400).json( {message : "Password length must be atleast 6 characters long" } );
        }
        //searching users with same name
        const existingUser=await User.findOne({name:name});
        //searching users with same room number
        const existingRoom=await User.findOne({room:room});

        if(existingRoom){
            return res.status(400).json( {message : "Room Number already registered , please login"} );
        }

        if(existingUser){
            return res.status(400).json( {message : "Username already exists , please enter a different one"} );
        }

        const newUser=await User.create({
            name,
            password,
            room,
        });

        const accessToken=jwt.sign({userID:newUser._id},process.env.ACCESS_TOKEN_SECRET,{
            expiresIn:"20d"
        }); 

        //adding accessToken to cookie
        res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV==="production", 
        sameSite: 'Strict', 
        maxAge: 20 * 24 * 60 * 60 * 1000 
        }); 
     
        res.status(201).json({ succeess: true, user:newUser});

    } catch (error) {

        console.log(`Signin Error ${error}`);
        res.status(500);
    }

}



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
        secure: process.env.NODE_ENV==="production", 
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

