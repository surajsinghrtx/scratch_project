const express=require('express');
const router=express.Router();
const upload=require('../config/multer-config.js');
const productModel=require('../models/product-model.js')

router.post('/create',upload.single('productImage'),async (req,res)=>{  // file comes into req.file not into req.body
   let {productName,productPrice,productDiscount,bgcolor,panelcolor,textcolor}=req.body;
    let createdproduct=await productModel.create({
      image:req.file.buffer,  /////// for buffer use req.file.buffer not req.file.fileename(from the form)
      name:productName,
       price:productPrice,
       discount:productDiscount,
       bgcolor,
       panelcolor,
       textcolor
    })
    req.flash('success','product created successfully')  // with the name of success it goes to owners/admin
    res.redirect('/owners/admin');   // flash automatically goes to this route
})


module.exports=router;


