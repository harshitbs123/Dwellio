const express = require("express");
const app = express();
const port = 3030;
const mongoose = require("mongoose");
const methodOverride = require("method-override");
// error
// try-catch removal
const wrapAsync = require("./utils/wrapAsync.js");
// status-msg define error
const ExpressError = require("./utils/ExpressError.js");
// patch-del form options
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
const List = require("./Models/listing");
app.use(express.urlencoded({ extended: true }));
const path = require("path");
app.use(express.static(path.join(__dirname, "assets")));

app.listen(port, () => {
  console.log(`App listening at port ${port}`);
});

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/rentora");
}

main()
  .then((res) => {
    console.log("connected to mongoose");
  })
  .catch((err) => {
    console.log("error in mongoose");
  });

//test

app.get("/test", async (req, res) => {
  const listings = [
    {
      title: "Coastal Paradise Villa",
      description:
        "A beautiful luxury villa near the beach with spacious rooms, modern interiors and a peaceful atmosphere, perfect for a relaxing vacation.",
      price: 13500,
      location: "Alibaug, Maharashtra 402201",
      country: "India",
    },
  ];
  await List.insertMany(listings);
});
// Index Route
app.get("/listings", async (req, res) => {
  const Listings = await List.find();
  res.render("home.ejs", { Listings });
});

//Create Route
app.get("/listings/host", async (req, res) => {
  res.render("host.ejs");
});
app.post(
  "/listings",
  wrapAsync(async (req, res, next) => {
    const newListing = new List(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  }),
);

//Show Route
app.get("/listings/:id", async (req, res, next) => {
  let { id } = req.params;
  const Listing = await List.findById(id);
  res.render("show.ejs", { Listing });
});

//update
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await List.findById(id);
  res.render("edit.ejs", { listing });
});

app.patch("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await List.findByIdAndUpdate(id, req.body.listing);
  res.redirect(`/listings/${id}`);
});
// delete

app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await List.findByIdAndDelete(id);
  res.redirect("/listings");
});

// all
app.all("/{*splat}", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// err handling middle-ware

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
