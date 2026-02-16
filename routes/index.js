const express=require('express')
const router=express.Router();
const isLoggedin=require('../middlewares/isLoggedin.js')
const productModel=require('../models/product-model.js')
const userModel=require('../models/user-model.js');
const reviewModel=require('../models/reviews_model.js')

router.get("/",(req,res)=>{
    let error=req.flash("error");
    res.render('index',{error});
})



router.get('/shop',isLoggedin,async (req,res)=>{
    let error=req.flash('error');
    let success=req.flash('success');  // after using filer express sees url like /shop?price=x-y
    let filter={};
    let price=req.query.price;
    if(price){                       // here req.query is object  {price:x-y}
       const [min,max]=req.query.price.split('-').map(Number);
       filter.price={
        $gte:min,
        $lte:max
       };
      
    }                            
   
     let allProducts=await productModel.find(filter);  // array of objects (if filter is empty then it will select all products)
     res.render("shop",{allProducts,error,success,price});
})



router.get('/addtocart/:productId',isLoggedin,async (req,res)=>{
     let user=await userModel.findOne({email:req.user.email});
     let price=req.query.price || '';
     if(user.cart.includes(req.params.productId)){                         ////// here req.params.productId ----> string before await user.save
        req.flash('error','product already added to cart');  // flash goes to shop
       return res.redirect(price ?`/shop?price=${price}`: '/shop');
        
     }
     
     user.cart.push(req.params.productId);   //******* here we are push productId(which is a string coming from the URL) */
     await user.save();                          /////// after await user.save() mongoose changes these id's into objectId("that id's string ")
     req.flash('success','product added to cart');  //flash goes to shop 
     res.redirect(price?`/shop?price=${price}`:'/shop');
       
})




router.get('/cart',isLoggedin,async (req,res)=>{     // before sending user ---> populate it's cart array
    let user=await userModel.findOne({email:req.user.email}).populate('cart');  //////// here we replace product's id with product's detail(object ) using populate( ** cart is the name of array)
    res.render('cart',{user});                                                     ///// this population occurs for only that route if we go to other route from this route then cart will be not populated
})                                                                                   ////// still the cart contain the product id not the populated cart

router.get('/remove/:productId',isLoggedin,async (req,res)=>{
    let user= await userModel.findOne({email:req.user.email});
   let index=user.cart.indexOf(req.params.productId);
    if(index!=-1){
        user.cart.splice(index,1);   ///// removal of product by index
        await user.save();
        res.redirect('/cart');
    }
    
})




router.get('/myaccount',isLoggedin,async (req,res)=>{
    let user=await userModel.findOne({email:req.user.email});
    res.render('myaccount',{user});
})



router.get('/yourproduct/:productId',isLoggedin,async (req,res)=>{
    let product=await productModel.findOne({_id:req.params.productId}).populate({
        path:'reviews_by_users',
        populate:{
            path:'user', // pupulated user (in which user_id is replaced by user_detail)
            select:"fullname"  // here fullname of user(user fullname not any random variable)    // now there will be only fullname of user instead of user whole detail     // we can access it by review.user.fullname on frontened
        }
    })
    let user=await userModel.findOne({email:req.user.email});
    
    if(product){
   return res.render('yourproduct',{product,user});
    }
    else{
        res.send("not found");
    }
})




router.post('/api/reviews/:productId',isLoggedin,async (req,res)=>{     /// reviews of users are coming
    let user=await userModel.findOne({email:req.user.email});
    let product=await productModel.findOne({_id:req.params.productId});
    if(req.body.comment==="" || req.body.comment.trim()===""){
        return res.send("error");
    }
   
    let review=await reviewModel.create({
    user:user._id,
    product:product._id,
    comment:req.body.comment
    })
    user.reviews_on_product.push(review._id);
    product.reviews_by_users.push(review._id);
    await user.save();
    await product.save();
    return res.redirect(`/yourproduct/${product._id}`) //// here we have to send give here product._id not the text product._id  /////// don't send any data during redirecting
   
    
})

module.exports=router;
