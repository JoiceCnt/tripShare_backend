import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  destinationCode: { type: String, required: true }, // ISO2 do país
  city: String,
  text: { type: String },
  imageUrl: { type: String }, // URL da imagem no Cloudinary
  ratings: {
    gastronomy: { type: Number, min: 0, max: 5, default: 0 },
    events: { type: Number, min: 0, max: 5, default: 0 },
    petFriendly: { type: Number, min: 0, max: 5, default: 0 },
    kidsFriendly: { type: Number, min: 0, max: 5, default: 0 },
    culture: { type: Number, min: 0, max: 5, default: 0 },
    nature: { type: Number, min: 0, max: 5, default: 0 },
    shopping: { type: Number, min: 0, max: 5, default: 0 },
    safety: { type: Number, min: 0, max: 5, default: 0 },
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Review", reviewSchema);
