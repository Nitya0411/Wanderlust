const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const reviewSchema=new Schema({
    comment:String,
    rating:{
        min:1,
        max:5,
        type:Number
    },
    created_at:{
        default:Date.now(),
        type:Date
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    
    }
});

module.exports=mongoose.model("Review",reviewSchema);