import mongoose, { Schema, Document } from "mongoose";

export interface ICheckIn extends Document {
  userId: string;
  mood: string;
  note: string;
  createdAt: Date;
}

const CheckInSchema = new Schema<ICheckIn>({
  userId: { type: String, required: true, index: true },
  mood: { type: String },
  note: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ICheckIn>("CheckIn", CheckInSchema);
