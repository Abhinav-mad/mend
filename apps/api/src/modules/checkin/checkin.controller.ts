import { Request, Response } from "express";
import CheckIn from "./checkin.model";

export const createCheckIn = async (req: Request, res: Response) => {
  try {
    const userId = req.userId!; 
    const { mood, note } = req.body;
    const entry = new CheckIn({userId, mood, note });
    await entry.save();
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: "Failed to save check-in" });
  }
};

export const getCheckIns = async (_req: Request, res: Response) => {
  try {
    const userId = _req.userId!;
        const { startedAt } = _req.query;

    const query: any = { userId };
    if (startedAt) {
      query.createdAt = { $gte: new Date(startedAt as string) };
    }

    const entries = await CheckIn.find(query).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch check-ins" });
  }
};

export const deleteCheckIn = async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const checkIn = await CheckIn.findOneAndDelete({ _id: id, userId });

    if (!checkIn) {
      return res.status(404).json({ error: "Check-in not found" });
    }

    res.json({ success: true, data: checkIn });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete check-in" });
  }
};

