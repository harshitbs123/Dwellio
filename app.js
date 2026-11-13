const express = require("express");
const app = express();
const port = 3030;
const session = require("express-session");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./Models/user")
// SESSION
app.use(
  session({
    secret: "mysecretstring",
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// FLASH
app.use(flash());

// Make flash messages available in all EJS files
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Routes
const listingRoutes = require("./routes/listing");
const reviewRoutes = require("./routes/review");
const userRoutes = require("./routes/user")

// Models & Error Utilities
const Listing = require("./Models/listing");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");

// Middleware & View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "assets")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/rentora")
  .then(() => console.log("Connected to MongoDB (rentora database)"))
  .catch((err) => console.log("MongoDB connection error:", err.message));

// Home Route
app.get(
  "/",
  wrapAsync(async (req, res) => {
    let listings = [];
    try {
      listings = await Listing.find();
    } catch (e) {
      listings = [];
    }
    res.render("landing.ejs", { listings });
  }),
);
// Create flash message
app.get("/test", (req, res) => {
  req.flash("success", "Welcome to Dwellio!");
  res.redirect("/");
});

// Mount Routers
app.use("/", userRoutes);
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);

// 404 Handler
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// Central Error Handler
app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong!" } = err;
  if (err.name === "CastError") return res.status(404).render("404Cast.ejs");
  if (status === 404) return res.status(404).render("404.ejs");
  res.status(status).send(message);
});

// Start Server
app.listen(port, () => {
  console.log(`Dwellio server running at http://localhost:${port}`);
});
