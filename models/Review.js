import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  country: { type: String, required: true }, // salva o nome do país
  text: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Review", reviewSchema);
