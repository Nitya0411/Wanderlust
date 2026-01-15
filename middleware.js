const Listing=require("./models/listing.js");
const Review=require("./models/review.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js");
const {reviewSchema}=require("./schema.js");


module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in!");
        return res.redirect("/login");
    }
    next();
}


module.exports.redirectUrl=(req,res,next)=>{
    if( req.session.redirectUrl){
        res.locals.redirectUrl= req.session.redirectUrl;
         
    }
    next();
}


module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
     let listing=await Listing.findById(id);
    if(listing &&!listing.owner._id.equals(req.user._id)){
        req.flash("error","You don't have permission to edit");
        return res.redirect(`/listings/${id}`);    }

next();
};


module.exports.validateListing=(req,res,next)=>{
     let {error}=listingSchema.validate(req.body);
   
     if(error){
        throw new ExpressError(error,400);
    }else{
        next();
    }
};

module.exports.validateReview=(req,res,next)=>{
     let {error}=reviewSchema.validate(req.body);
   
     if(error){
        throw new ExpressError(error,400);
    }else{
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { reviewId, id } = req.params;
  const review = await Review.findById(reviewId);
  if (review&&!review.author._id.equals(req.user._id)) {
    req.flash("error", "You do not have permission");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
