import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // <- ref a User
  text: { type: String, required: true },
  rating: { type: Number, required: true },
  data: { type: Date, default: Date.now }
});

export default mongoose.model("Review", reviewSchema);
