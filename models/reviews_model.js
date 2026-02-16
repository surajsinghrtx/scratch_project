const mongoose=require("mongoose");



////// it will tell for which product this review is
//////  by which user this review is given
//////  and last what review is

const reviewSchema=mongoose.Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'product',
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    comment:{
        type:String,
        trim:true,
        required:true
    }

})

module.exports=mongoose.model('review',reviewSchema);