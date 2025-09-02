import { Request, Response } from "express";
import SpacePlan from "./spacePlan.model";

export const startSpace = async (req: Request, res: Response) => {
  try {
    const { days } = req.body;
    const plan = new SpacePlan({ days });
    await plan.save();
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: "Failed to start space" });
  }
};

export const getSpaces = async (_req: Request, res: Response) => {
  console.log("req❤️❤️",_req)
  try {
    const plans = await SpacePlan.find().sort({ startedAt: -1 });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch spaces" });
  }
};
