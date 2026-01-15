const User=require("../models/user");

module.exports.renderSignup=(req,res)=>{
    res.render("./user/signup.ejs")
};

module.exports.signup=async(req,res)=>{
    try{
        let{username,email,password}=req.body;
    const newUser=new User({email,username});
    let registeredUser=await User.register(newUser,password);
    req.login(registeredUser,(err)=>{
        if(err){
            next(err);
        }
        req.flash("success","Welcome to Wanderlust");
        res.redirect("/listings");
    })
    
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");

    }
};

module.exports.renderLogin=(req,res)=>{
    res.render("./user/login.ejs")
};

module.exports.login=async(req,res)=>{
     req.flash("success","Welcome to Wanderlust! You are logged in!");
     const redirect = res.locals.redirectUrl || "/listings";
    delete req.session.redirectUrl;
    res.redirect(redirect);
     
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    })
};