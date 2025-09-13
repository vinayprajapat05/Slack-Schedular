import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import mongoose from "mongoose";
import { setupAgenda } from "./agenda";

const PORT = process.env.PORT || 4000;
const MONGO = process.env.MONGO_URI!;

async function start() {
  await mongoose.connect(MONGO);
  console.log("Connected to MongoDB");
  await setupAgenda(); // start agenda and job definitions
  app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
}

start().catch((err) => {
  console.error("Startup error:", err);
  process.exit(1);
});

