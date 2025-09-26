import { Request, Response, NextFunction } from "express";

export function identify(req: Request, res: Response, next: NextFunction) {
  const userId = (req.headers["x-user-id"] as string) || "";
  if (!userId) return res.status(401).json({ error: "X-User-Id header required" });
  req.userId = userId;
  next();
}
