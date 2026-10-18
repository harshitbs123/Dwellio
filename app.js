const express = require("express");
const app = express();
const port = 3030;
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");

// Error Utilities
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

// Models
const List = require("./Models/listing");
const Review = require("./Models/review")

// Middleware
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static assets from assets folder (both at root and /assets prefix)
app.use(express.static(path.join(__dirname, "assets")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Connect to MongoDB
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/rentora");
}

main()
  .then(() => {
    console.log("Connected to MongoDB (rentora database)");
  })
  .catch((err) => {
    console.log("Could not connect to MongoDB:", err.message);
  });

// ----------------------------------------
// ROUTES
// ----------------------------------------

// 1. Homepage Route (dwellio /)
app.get(
  "/",
  wrapAsync(async (req, res) => {
    let listings = [];
    try {
      listings = await List.find();
    } catch (e) {
      listings = [];
    }
    res.render("landing.ejs", { listings });
  }),
);

// 2. All Listings Catalog Route (/listings)
app.get(
  "/listings",
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

    let Listings = [];
    try {
      Listings = await List.find(query);
    } catch (e) {
      Listings = [];
    }

    res.render("listings.ejs", { Listings, search: search || "" });
  }),
);

// 3. Create / Host Route
app.get("/listings/host", (req, res) => {
  res.render("host.ejs");
});

app.post(
  "/listings",
  wrapAsync(async (req, res) => {
    const newListing = new List(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  }),
);

// 4. Show Single Listing Route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const Listing = await List.findById(id);
    if (!Listing) {
      return next(new ExpressError(404, "Listing Not Found"));
    }
    res.render("show.ejs", { Listing });
  }),
);

// 5. Edit Listing Route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await List.findById(id);
    if (!listing) {
      return next(new ExpressError(404, "Listing Not Found"));
    }
    res.render("edit.ejs", { listing });
  }),
);

app.patch(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await List.findByIdAndUpdate(id, req.body.listing);
    res.redirect(`/listings/${id}`);
  }),
);

// 6. Delete Listing Route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await List.findByIdAndDelete(id);
    res.redirect("/listings");
  }),
);

// 7. Seed Test Listing Route
app.get(
  "/test",
  wrapAsync(async (req, res) => {
    const listings = [
      {
        title: "Coastal Paradise Villa",
        description:
          "A beautiful luxury villa near the beach with spacious rooms, modern interiors, and a peaceful atmosphere, perfect for a relaxing vacation.",
        price: 13500,
        location: "Alibaug, Maharashtra 402201",
        country: "India",
      },
    ];
    await List.insertMany(listings);
    res.send("Test listing added!");
  }),
);

// ----------------------------------------
// ERROR HANDLING
// ----------------------------------------

// Unhandled routes -> 404
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// Central Error Handling Middleware
app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong!" } = err;
  if (err.name === "CastError") {
    return res.status(404).render("404Cast.ejs");
  }
  if (status === 404) {
    return res.status(404).render("404.ejs");
  } else {
    return res.status(status).send(message);
  }
});

app.listen(port, () => {
  console.log(`Dwellio server running at http://localhost:${port}`);
});
