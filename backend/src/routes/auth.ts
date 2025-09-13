import express from "express";
import { install, callback } from "../controllers/authController";
const router = express.Router();
router.get("/install", install);
router.get("/callback", callback);
export default router;

