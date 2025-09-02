import mongoose, { Schema, Document } from "mongoose";

export interface ISpacePlan extends Document {
  days: number;
  startedAt: Date;
}

const SpacePlanSchema = new Schema<ISpacePlan>({
  days: { type: Number, required: true },
  startedAt: { type: Date, required: true, default: Date.now }
});

export default mongoose.model<ISpacePlan>("SpacePlan", SpacePlanSchema);
