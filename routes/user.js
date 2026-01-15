const express=require("express");
const { required } = require("joi");
const router=express.Router({});
const User=require("../models/user.js");
const asyncWrap=require("../utils/asyncWrap.js");
const passport=require("passport");
const {redirectUrl}=require("../middleware.js");
const userController=require("../controllers/users.js");

//signup
router.route("/signup")
.get(userController.renderSignup)
.post(asyncWrap(userController.signup));

//Login
router.route("/login")
.get(userController.renderLogin)
.post(redirectUrl,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),asyncWrap(userController.login));

//Logout
router.get("/logout",userController.logout);

module.exports=router;