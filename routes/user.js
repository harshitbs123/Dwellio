const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../Models/user");
const Listing = require("../Models/listing");
const Review = require("../Models/review");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");

// Middleware to preserve the URL user wanted before being sent to login
const saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

router.get("/signup", (req, res) => {
  if (req.isAuthenticated()) {
    req.flash("error", "You are already logged in!");
    res.redirect("/listings")
  } else res.render("users/signup.ejs");
});

router.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    req.flash("error", "You are already logged in!");
    res.redirect("/listings")
  } else res.render("users/login.ejs");
});

router.post("/signup", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const user = new User({
      username,
      email,
    });

    const registeredUser = await User.register(user, password);

    req.login(registeredUser, (err) => {
      if (err) {
        req.flash("error", err.message);
        return next(err);
      }
      req.flash("success", "Welcome to Dwellio!");
      let redirectUrl = req.session.redirectUrl || "/listings";
      delete req.session.redirectUrl;
      res.redirect(redirectUrl);
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
});

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", `Welcome back, ${req.user.username}!`);
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  },
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have logged out successfully!");
    res.redirect("/listings");
  });
});

module.exports = router;