import express from "express";
import cors from "cors";
import "express-async-errors";
import authRoutes from "./routes/auth";
import apiRoutes from "./routes/api";

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/api", apiRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: any) => {
  console.error(err);
  res.status(500).json({ error: err.message || "server error" });
});

export default app;

