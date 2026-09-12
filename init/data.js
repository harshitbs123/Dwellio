const mongoose = require("mongoose");

const listSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default:
      "https://www.dellaresorts.com/new-images/new-camp-della-exterior-v4.webp",
    set: (v) =>
      v === ""
        ? "https://www.dellaresorts.com/new-images/new-camp-della-exterior-v4.webp"
        : v,
  },
  price: Number,
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});

const List = new mongoose.model("List", listSchema);

module.exports = { data : SampleListings };