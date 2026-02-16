// const jwt=require('jsonwebtoken');
// const userModel = require('../models/user-model');

// module.exports=async (req,res,next)=>{
//     if(!req.cookies.token){
//         req.flash('error','you need to login first...');
//         return res.redirect('/');  // ****** due to flash that error is also going to that route
//     }
    
//     try{
//        let data= jwt.verify(req.cookies.token,process.env.JWT_KEY);  //here data is object of email and userid
//        let user=await userModel.findOne({email:data.email}).select("-password");   // user is the object which do not contain password

//        req.user=user;   // data of user attaced with req.user  (req.user same as user ----> same object)
//        next();
//     }catch(err){
//     req.flash("error","something went wrong");
//     res.redirect('/');
//     }
     
// }

const jwt = require('jsonwebtoken');
const userModel = require('../models/user-model');
const mongoose = require('mongoose');

// Helper function to wait for DB connection
const waitForDB = async (timeout = 5000) => {
    const startTime = Date.now();
    
    // If already connected, return immediately
    if (mongoose.connection.readyState === 1) {
        return true;
    }
    
    console.log('⏳ Auth waiting for DB connection... Current state:', mongoose.connection.readyState);
    
    // Wait for connection
    while (mongoose.connection.readyState !== 1) {
        if (Date.now() - startTime > timeout) {
            throw new Error('Database connection timeout');
        }
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('✅ Auth: DB connected, proceeding');
    return true;
};

module.exports = async (req, res, next) => {
    // Log state for debugging
    console.log('Auth check - DB State:', mongoose.connection.readyState);
    
    // Check for token
    if (!req.cookies.token) {
        req.flash('error', 'You need to login first...');
        return res.redirect('/');
    }
    
    try {
        // CRITICAL: Wait for DB connection before proceeding
        await waitForDB(5000);
        
        // Verify token
        const data = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        
        // Find user
        const user = await userModel.findOne({ email: data.email }).select("-password");
        
        if (!user) {
            req.flash('error', 'User not found');
            return res.redirect('/');
        }
        
        req.user = user;
        next();
        
    } catch (err) {
        console.error('Auth error:', err.message);
        
        if (err.message === 'Database connection timeout') {
            req.flash('error', 'System is starting up. Please try again in 5 seconds.');
        } else if (err.name === 'JsonWebTokenError') {
            req.flash('error', 'Invalid session. Please login again.');
        } else {
            req.flash('error', 'Something went wrong. Please try again.');
        }
        
        return res.redirect('/');
    }
};