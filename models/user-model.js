const mongoose=require('mongoose');



const userSchema=mongoose.Schema({
    fullname:{
        type:String,
        minLength:3,
        trim:true,
    },
    email:String,
    password:String,
                     // inside the user's cart we will insert the product( id of that product by the id we can find which product is that)
    cart:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'product'
    }],
    
    
    orders:{
        type:Array,
        default:[]
    },
    reviews_on_product:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'review',
        default:[]
    }],
             
    contact:Number,
    image:Buffer
});

module.exports=mongoose.model('user',userSchema);