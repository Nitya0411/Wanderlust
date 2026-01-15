const express=require("express");
const router=express.Router({mergeParams:true});
const asyncWrap=require("../utils/asyncWrap.js");
const Listing=require("../models/listing.js");
const Review = require("../models/review.js");
const {isOwner,validateListing,isLoggedIn}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage});

router.route("/")
.get(asyncWrap(listingController.index))
.post(isLoggedIn,upload.single('listing[image]'),validateListing,asyncWrap(listingController.createListing));



//NEW ROUTE
router.get("/new",isLoggedIn,listingController.renderNewForm);

//SEARCH ROUTE
router.get("/search", asyncWrap(listingController.searchListings));

//CATEGORY ROUTE
router.get("/category/:category", asyncWrap(listingController.categoryListings));

router.route("/:id")
.get(asyncWrap(listingController.showListing))
.delete(isLoggedIn,isOwner,asyncWrap(listingController.destroyListing))
.patch(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing, asyncWrap(listingController.updateListing));

//UPDATE ROUTE
router.get("/:id/edit",isLoggedIn,isOwner,validateListing,asyncWrap(listingController.renderEditForm));



module.exports=router;