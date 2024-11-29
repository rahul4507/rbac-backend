const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
console.log(process.env.DATABASE_URL);
let DB = process.env.DATABASE_URL.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);
DB = DB.replace("<db_name>", process.env.DATABASE_NAME);
console.log(DB);

const connectToDB = async () => {
  try {
    await mongoose.connect(DB);
    console.log("Connected to MongoDB Atlas successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
};

module.exports = connectToDB;
