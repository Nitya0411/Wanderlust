if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const dbUrl = process.env.AtlasDB_Url;

const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const MongoStore = require("connect-mongo").default;
const User = require("./models/user.js");
const ExpressError = require("./utils/ExpressError.js");

// ROUTES
const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");


app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// STATIC FILES & PARSERS
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));


// CONNECTION MONGO
mongoose.connect(dbUrl)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));


const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: { secret: process.env.SECRET },
  touchAfter: 24 * 3600
});

store.on("error", (err) => console.log("Mongo Store Error:", err));

const sessionOptions = {
  store,
  secret:process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
};

app.use(session(sessionOptions));
app.use(flash());

//PASSPORT
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
  res.locals.currUser = req.user || null; 
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});


// HOME REDIRECT
app.get("/", (req, res) => {
  res.redirect("/listings");
});

// ROUTES
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// 404 HANDLER (must be LAST)
app.all("/", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});


app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("./listings/error.ejs", { message });
});


// STARTING SERVER
app.listen(8080, () => {
  console.log("App is listening on port 8080");
});
