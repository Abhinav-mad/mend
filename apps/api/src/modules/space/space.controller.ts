import { Request, Response } from "express";
import SpacePlan from "./spacePlan.model";

export const startSpace = async (req: Request, res: Response) => {
  try {
    const { days } = req.body;

    const userId = req.userId!;

    let plan = await SpacePlan.findOne({ userId, status: { $in: ["active", "paused"] } });

    if (plan) {
      plan.startedAt = new Date();
      plan.status = "active";
      plan.days = days;
      await plan.save();
    } else {
      plan = await SpacePlan.create({
        userId,
        days: days,
        status: "active"
      });
    }
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: "Failed to start space" });
  }
};

export const getSpaces = async (_req: Request, res: Response) => {
  try {
    const userId = _req.userId!;
    const plan = await SpacePlan.findOne({ userId }).sort({ updatedAt: -1 });

    res.json({
      success: true,
      data: plan
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch spaces" });
  }
};

export async function pauseSpaceController(req: Request, res: Response) {
  try {
    const userId = req.userId!;
    const plan = await SpacePlan.findOne({ userId, status: "active" });
    if (!plan) return res.status(404).json({ error: "No active plan" });
    plan.status = "paused";
    await plan.save();
    return res.json({ data: plan });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to pause space" });
  }
}

export const adjustSpaceGoal = async (req: Request, res: Response) => {
  try {
    const { days } = req.body;
    const userId = req.userId!;

    let plan = await SpacePlan.findOne({ userId, status: "active" });
    if (!plan) return res.status(404).json({ error: "No active plan" });

    const elapsedDays = Math.floor(
      (Date.now() - new Date(plan.startedAt).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (days <= elapsedDays) {
      return res.status(400).json({
        code: "NEW_GOAL_BELOW_PROGRESS",
        message: `You’ve already completed ${elapsedDays} days, so you can’t set the goal to ${days}.`,
      });
    }

    plan.days = days;   // only update goal
    await plan.save();

    res.json({ success: true, data: plan });
  } catch (err) {
    res.status(500).json({ error: "Failed to adjust goal" });
  }
};

