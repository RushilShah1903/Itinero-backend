import mongoose from "mongoose";

const TripSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  date: { type: Date, required: true },
  reason: { type: String, required: true },
  estimatedCost: { type: Number, required: true },
  inclusion: { type: String, enum: ["hotel", "flight", "both"], required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
});

export default mongoose.model("Trip", TripSchema);
