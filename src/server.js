import dotenv from "dotenv";

dotenv.config();

const { default: app } = await import("./app.js");
const { default: connectDB } = await import("./config/database.js");

connectDB();

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor iniciado");
});