const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../Models/user");
const Listing = require("../Models/listing");
const Review = require("../Models/review");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const user = new User({
            username,
            email
        });

        const registeredUser = await User.register(user, password);

        req.login(registeredUser, (err) => {
            if (err) {
                req.flash("error", err.message);
                return next(err);
            }
            req.flash("success", "Welcome to Dwellio!");
            res.redirect("/listings");
        });

    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
});

router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
    (req, res) => {
        req.flash("success", `Welcome back, ${req.user.username}!`);
        res.redirect("/listings");
    }
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