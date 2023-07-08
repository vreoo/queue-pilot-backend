import express from "express";
import { createQueue, getQueue, getQueues } from "../controllers/queue.js";

const router = express.Router();

router.get("/find/:queueId", getQueue);
router.post("/create", createQueue);
router.get("/getQueues", getQueues);

export default router;
