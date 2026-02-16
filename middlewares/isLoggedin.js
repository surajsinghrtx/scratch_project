const jwt=require('jsonwebtoken');
const userModel = require('../models/user-model');

module.exports=async (req,res,next)=>{
    if(!req.cookies.token){
        req.flash('error','you need to login first...');
        return res.redirect('/');  // ****** due to flash that error is also going to that route
    }
    
    try{
       let data= jwt.verify(req.cookies.token,process.env.JWT_KEY);  //here data is object of email and userid
       let user=await userModel.findOne({email:data.email}).select("-password");   // user is the object which do not contain password

       req.user=user;   // data of user attaced with req.user  (req.user same as user ----> same object)
       next();
    }catch(err){
    req.flash("error","something went wrong");
    res.redirect('/');
    }
       
       
    
}