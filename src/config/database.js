import mongoose from "mongoose";
import "dotenv/config";

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI);

mongoose.connection.on("connected", () => {
  console.log("Connected to database successfully");
});

mongoose.connection.on("error", (err) => {
  console.log("Failed to connect to database", err.message);
});

export default mongoose;
