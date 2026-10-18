const mongoose = require("mongoose");
const data = require("./data.js");
const Listing = require("../Models/listing.js");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/rentora");
}

main()
  .then(async () => {
    console.log("Connected to MongoDB successfully");
    await initDB();
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    await Listing.insertMany(data.data);
    console.log("Sample listings data successfully initialized in Dwellio database!");
  } catch (e) {
    console.error("Failed to initialize data:", e);
  } finally {
    await mongoose.connection.close();
  }
};