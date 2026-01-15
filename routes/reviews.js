const express=require("express");
const router=express.Router({mergeParams:true});
const asyncWrap=require("../utils/asyncWrap.js");
const Listing=require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js");

router.post("/",isLoggedIn,validateReview,asyncWrap(reviewController.addReview));
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,asyncWrap(reviewController.destroyReview));

module.exports=router;