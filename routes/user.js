const express = require("express");
const router = express.Router();
const Listing = require("../Models/listing");
const Review = require("../Models/review");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");


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
                req.flash("error", err)
            }
            res.redirect("/listings");
        });

    } catch (err) {
        res.redirect("/signup");
    }
});

router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/login"
    }),
    (req, res) => {
        res.redirect("/listings");
    }
);

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        res.redirect("/listings");
    });
});