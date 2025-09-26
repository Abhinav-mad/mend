import mongoose, { Schema, Document } from "mongoose";


export type SpaceStatus = "active" | "paused" | "completed";
export interface ISpacePlan extends Document {
  userId: string;
  days: number;
  startedAt: Date;
  status: SpaceStatus;
}

const SpacePlanSchema = new Schema<ISpacePlan>({
  userId: { type: String, required: true, index: true },
  days: { type: Number, required: true },
  status: { type: String, enum: ["active", "paused", "completed"], default: "active" },
  startedAt: { type: Date, required: true, default: Date.now }
});

export default mongoose.model<ISpacePlan>("SpacePlan", SpacePlanSchema);
