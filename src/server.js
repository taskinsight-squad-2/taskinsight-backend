import express from "express";
import dotenv from "dotenv/config";
import router from "./routes/index.js";
import "./config/database.js";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(router);

app.listen(3000, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
