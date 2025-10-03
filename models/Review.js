// models/Review.js
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    destinationCode: { type: String, required: true },
    city: { type: String },
    text: { type: String, required: true },
    imageUrl: { type: String },
    ratings: {
      gastronomy: { type: Number, default: 0 },
      events: { type: Number, default: 0 },
      petFriendly: { type: Number, default: 0 },
      kidsFriendly: { type: Number, default: 0 },
      culture: { type: Number, default: 0 },
      nature: { type: Number, default: 0 },
      shopping: { type: Number, default: 0 },
      safety: { type: Number, default: 0 },
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [commentSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);