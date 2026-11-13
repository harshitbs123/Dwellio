const express = require("express");
const router = express.Router();
const Listing = require("../Models/listing");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");
const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in!");
        return res.redirect("/login");
    }
    next();
};

// Index: All listings & search
router.get(
  "/",
  wrapAsync(async (req, res) => {
    let { search } = req.query;
    let query = {};

    if (search && search.trim() !== "") {
      let s = search.trim();
      query = {
        $or: [
          { title: { $regex: s, $options: "i" } },
          { location: { $regex: s, $options: "i" } },
          { country: { $regex: s, $options: "i" } },
          { description: { $regex: s, $options: "i" } },
        ],
      };
    }

    let listings = [];
    try {
      listings = await Listing.find(query);
    } catch (e) {
      listings = [];
    }

    res.render("listings/listings.ejs", { listings, search: search || "" });
  }),
);

// New: Render host form
router.get("/host",isLoggedIn, (req, res) => {
  res.render("listings/host.ejs");
});

// Create: Add new listing
router.post(
  "/",
  wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    // 1. Add the flash message
    req.flash("success", "Listing successfully created!");
    res.redirect("/listings");
  }),
);

// Show: Listing details
router.get(
  "/:id",
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      return next(new ExpressError(404, "Listing Not Found"));
    }
    res.render("listings/show.ejs", { listing });
  }),
);

// Edit: Render edit form
router.get(
  "/:id/edit",isLoggedIn,
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      return next(new ExpressError(404, "Listing Not Found"));
    }
    res.render("listings/edit.ejs", { listing });
  }),
);

// Update: Save edited listing
router.patch(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing);
    res.redirect(`/listings/${id}`);
  }),
);

// Delete: Remove listing
router.delete(
  "/:id",isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    // 1. Add the flash message
    req.flash("error", "Listing successfully deleted!");
    
    res.redirect("/listings");
  }),
);

module.exports = router;
