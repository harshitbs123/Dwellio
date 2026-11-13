const express = require("express");
const router = express.Router();
const Listing = require("../Models/listing");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");

// Authentication middleware
const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to host or manage a property!");
    return res.redirect("/login");
  }
  next();
};

// Authorization middleware (only the owner can edit or delete)
const isOwner = wrapAsync(async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  if (!listing.owner || !listing.owner.equals(req.user._id)) {
    req.flash("error", "You do not have permission to edit or delete this listing!");
    return res.redirect(`/listings/${id}`);
  }
  next();
});

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
      listings = await Listing.find(query).populate("owner");
    } catch (e) {
      listings = [];
    }

    res.render("listings/listings.ejs", { listings, search: search || "" });
  }),
);

// New: Render host form (Requires Login)
router.get("/host", isLoggedIn, (req, res) => {
  res.render("listings/host.ejs");
});

// Create: Add new listing (Requires Login & Attaches Current User as Owner)
router.post(
  "/",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "Listing successfully created!");
    res.redirect(`/listings/${newListing._id}`);
  }),
);

// Show: Listing details
router.get(
  "/:id",
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate("reviews")
      .populate("owner");
    if (!listing) {
      return next(new ExpressError(404, "Listing Not Found"));
    }
    res.render("listings/show.ejs", { listing });
  }),
);

// Edit: Render edit form (Requires Login & Ownership)
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      return next(new ExpressError(404, "Listing Not Found"));
    }
    res.render("listings/edit.ejs", { listing });
  }),
);

// Update: Save edited listing (Requires Login & Ownership)
router.patch(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing);
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
  }),
);

// Delete: Remove listing (Requires Login & Ownership)
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing successfully deleted!");
    res.redirect("/listings");
  }),
);

module.exports = router;
