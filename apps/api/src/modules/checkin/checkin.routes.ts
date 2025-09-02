import { Router } from "express";
import { createCheckIn, getCheckIns } from "./checkin.controller";

const router = Router();

router.post("/", createCheckIn);
router.get("/", getCheckIns);

export default router;
