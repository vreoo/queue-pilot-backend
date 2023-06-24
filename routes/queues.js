import express from "express";
import { createQueue, getQueue } from "../controllers/queue.js";

const router = express.Router();

router.get("/find/:queueId", getQueue);
router.post("/create", createQueue);

export default router;
