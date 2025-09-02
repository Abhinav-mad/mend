import mongoose, { Schema, Document } from "mongoose";

export interface ICheckIn extends Document {
  mood: string;
  note: string;
  createdAt: Date;
}

const CheckInSchema = new Schema<ICheckIn>({
  mood: { type: String, required: true },
  note: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ICheckIn>("CheckIn", CheckInSchema);
