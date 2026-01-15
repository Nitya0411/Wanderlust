const mongoose=require("mongoose");
const Review=require("./review.js");
const listingSchema=new mongoose.Schema({
    title: {
    type: String,
    required: true,
  },
  description:{
    type: String,
    required: true,
  } ,
  
  image: {
    filename:String,
    url:{
        type:String,
    default:
      "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    set: (v) =>
      v === ""
        ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
        : v}
  },
  price: {
    type:Number,
  required: true,
  min:0
},
  category:{
    type:String,
    required: true,
    default: "trending",
    enum:["trending", "nature", "iconic cities", "mountains", "camps", "pools", "beachfront", "arctic", "pet-friendly", "luxury"]
  },
  location: {
    type: String,
    required: true,
  },

  country: {
    type: String,
    required: true,
  },
  reviews:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Review"

}],
owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"

},
geometry:{
  
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  
}

});

listingSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({ _id: { $in: doc.reviews } });
  }
});

const Listing=mongoose.model("listing",listingSchema);
module.exports=Listing;