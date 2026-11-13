const mongoose = require("mongoose");
const data = require("./data.js");
const Listing = require("../Models/listing.js");
const User = require("../Models/user.js");

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
    let admin = await User.findOne({ username: "admin" });
    const initData = data.data.map((obj) => ({
      ...obj,
      owner: admin ? admin._id : undefined,
    }));
    await Listing.insertMany(initData);
    console.log("Sample listings data successfully initialized with admin owner in Dwellio database!");
  } catch (e) {
    console.error("Failed to initialize data:", e);
  } finally {
    await mongoose.connection.close();
  }
};