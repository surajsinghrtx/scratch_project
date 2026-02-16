//*****do not require these things in every file  */
//const cookieParser=require('cookie-parser');
//const express=require('express');
//const app=express();
//app.use(cookieParser());


const bcrypt=require('bcrypt');
const userModel=require('../models/user-model.js');


const {generateToken}=require('../utils/generateToken.js')


module.exports.registerUser=async (req,res)=>{
    
let {fullname,email,password}=req.body;
let user=await userModel.findOne({email});
if(user){
   return res.status(401).json({message:'already have an account'})
}

    bcrypt.genSalt(10,(err,salt)=>{
        if(err){
            return res.status(500).json({message:'something went wrong!'});
        }
        bcrypt.hash(password,salt,async (err,hash)=>{
            if(err){
                return res.status(500).json({message:'something went wrong!'});
            }
         let createdUser=await userModel.create({
        fullname,
        email,
        password:hash
    })
    let token=generateToken(createdUser);    // token code is written in utils and also we can write code for bcrypt inside it
      res.cookie('token',token);
      res.redirect('/shop');
       
        })
    })
    
}

module.exports.loginUser=async (req,res)=>{
let {email,password}=req.body;
let user=await userModel.findOne({email});
if(!user){
    return res.status(401).json({message:"Invalid email or password"});
}

    bcrypt.compare(password,user.password,(err,result)=>{
         if(result){
            let token=generateToken(user);
            res.cookie('token',token);
            res.redirect('/shop');
         }
         else{
            return res.status(401).json({message:"invalid email or password"});
         }
    })

}

module.exports.logout=(req,res)=>{
    res.cookie('token',"");
    res.redirect('/');
}