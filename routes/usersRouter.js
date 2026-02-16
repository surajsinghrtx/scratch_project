const express=require('express');
const router=express.Router();

const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const cookieParser=require('cookie-parser');

const userModel=require('../models/user-model.js');
const {generateToken}=require('../utils/generateToken');

const {registerUser,loginUser,logout}=require('../controllers/authController.js')  // heavy logical things will be written here
const isLoggedin=require('../middlewares/isLoggedin.js')

router.get('/',(req,res)=>{
    res.send("hey");
})

router.post('/register',registerUser);

router.post('/login',loginUser);

router.get('/logout',logout);


module.exports=router;


