const mongoose = require("mongoose");
const data = require("./data.js");
const List = require("../Models/listing.js");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/rentora");
};

main()
  .then((res) => {
    console.log("connected to mongoose");
  })
  .catch((err) => {
    console.log("error in mongoose");
  });

const initDB  = async () => {
    await List.deleteMany({});
    await List.insertMany(initData.data);
    console.log("data was initialised");
};

initDB();