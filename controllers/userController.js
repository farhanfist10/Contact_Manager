const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

const registerContact = asyncHandler(async (req, res) => {
    const {username,email,password}=req.body;
    if(!username || ! email || !password){
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const userAvailable=await User.findOne({email});
    if(userAvailable){
        res.status(400);
        throw new Error("Email is already existed");
    }
    const hashedPassword=await bcrypt.hash(password,10);
    // console.log(hashedPassword);
    const user=await User.create({
        username,
        email,
        password:hashedPassword
    })
    console.log(`User ${user}`);
    if(user){
        res.status(201).json({_id:user.id,username,email})
    }
    else{
        res.status(400);
        throw new Error("User data is not valid")
    }
    res.json({message:"Registered the user"})
});

// login


const loginContact = asyncHandler(async (req, res) => {
    const {email,password}=req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("All fields are mandotary.")
    }
    const user=await User.findOne({email});
    if(user && await bcrypt.compare(password,user.password)){
        const accessToken=jwt.sign({
            user:{
                username:user.username,
                email:user.email,
                id:user.id,
            }
        },process.env.ACCESS_TOKEN_SECRET,{
            expiresIn:"20m"
        });
        res.status(200).json({accessToken});
    }else{
        res.status(400)
        throw new Error("Email or passwrod is not valid")
    }
  res.json({ message: "logged in the user" });
});

const current = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = {
  registerContact,
  loginContact,
  current,
};