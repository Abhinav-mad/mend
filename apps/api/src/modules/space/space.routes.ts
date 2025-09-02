import { Router } from "express";
import { startSpace, getSpaces } from "./space.controller";

const router = Router();

router.post("/", startSpace);
router.get("/", getSpaces);

export default router;
