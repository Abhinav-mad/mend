import { Router } from "express";
import { createCheckIn, deleteCheckIn, getCheckIns } from "./checkin.controller";

const router = Router();

router.post("/", createCheckIn);
router.get("/", getCheckIns);
router.delete("/:id", deleteCheckIn);

export default router;
