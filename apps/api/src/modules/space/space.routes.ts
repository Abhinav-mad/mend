import { Router } from "express";
import { startSpace, getSpaces, pauseSpaceController, adjustSpaceGoal } from "./space.controller";

const router = Router();

router.post("/", startSpace);
router.get("/", getSpaces);
router.post("/pause", pauseSpaceController);
router.post("/adjust", adjustSpaceGoal);

export default router;
