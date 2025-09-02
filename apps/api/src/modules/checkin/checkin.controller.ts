import { Request, Response } from "express";
import CheckIn from "./checkin.model";

export const createCheckIn = async (req: Request, res: Response) => {
  try {
    const { mood, note } = req.body;
    const entry = new CheckIn({ mood, note });
    await entry.save();
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: "Failed to save check-in" });
  }
};

export const getCheckIns = async (_req: Request, res: Response) => {
  try {
    const entries = await CheckIn.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch check-ins" });
  }
};
