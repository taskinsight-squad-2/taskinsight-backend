import mongoose from "mongoose";

const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/taskinsight";

const connectDatabase = async () => {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");
};

export default connectDatabase;
