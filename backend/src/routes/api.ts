import express from "express";
import {
  sendNow, scheduleMessage, listScheduled, cancelScheduled, channelsForTeam
} from "../controllers/messageController";
const router = express.Router();

router.post("/messages/send", sendNow);
router.post("/messages/schedule", scheduleMessage);
router.get("/messages/scheduled", listScheduled);
router.post("/messages/scheduled/:id/cancel", cancelScheduled);

router.get("/channels", channelsForTeam);

export default router;

