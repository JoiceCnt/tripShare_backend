import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  destinationCode: String,
  text: String,
  imageUrl: String, // link da imagem
  imageId: String, // id no Cloudinary (para deletar depois)
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Review", reviewSchema);
