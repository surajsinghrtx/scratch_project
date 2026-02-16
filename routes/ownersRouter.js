const express=require('express');
const router=express.Router();
const ownerModel=require('../models/owners-model.js')

router.get('/',(req,res)=>{    // opens only normal page
    res.send("hey hello");
})

//// creating the owner here

if(process.env.NODE_ENV==="development"){
router.post("/create",async (req,res)=>{                  // post is used when receiving any data through routes like here in req.body
   let owners=await ownerModel.find()  //array of objects
   if(owners.length>0){
    return res.status(503).send("you don't have permission to create a new owner");  
 }
 let {fullname,email,password}=req.body;
 let createdOwner=await ownerModel.create({
    fullname,
    email,
    password
 });
 res.status(201).send(createdOwner)
})
}

////// owner is going to add product in the panel

router.get('/admin',(req,res)=>{
   let success=req.flash('success');
   res.render('createProducts',{success});
})

module.exports=router;















