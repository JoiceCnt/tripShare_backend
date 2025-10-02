import express from "express";
import Review from "../models/Review.js";
import uploader from "../middlewares/cloudinary.config.js"; // middleware para upload no Cloudinary
import { v2 as cloudinary } from "cloudinary";

const router = express.Router();

// ✅ GET all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ CREATE a new review (com imagem opcional)
router.post(
  "/:destinationCode",
  uploader.single("imageUrl"),
  async (req, res) => {
    try {
      const newReview = await Review.create({
        destinationCode: req.params.destinationCode, // ISO2 do país
        text: req.body.text,
        imageUrl: req.file?.path || null, // salva a URL do Cloudinary
        imageId: req.file?.filename || null, // salva o `public_id` do Cloudinary (para deletar depois)
      });

      res.status(201).json(newReview);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ✅ UPDATE review (texto e/ou imagem)
router.put("/:id", uploader.single("imageUrl"), async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: "Review not found" });

    // Se tiver uma nova imagem, apaga a antiga no Cloudinary
    if (req.file && review.imageId) {
      await cloudinary.uploader.destroy(review.imageId);
    }

    review.text = req.body.text || review.text;
    if (req.file) {
      review.imageUrl = req.file.path;
      review.imageId = req.file.filename;
    }

    await review.save();
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE review (remove do banco + imagem no Cloudinary)
router.delete("/:id", async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: "Review not found" });

    // se tiver imagem no Cloudinary, deleta
    if (review.imageId) {
      await cloudinary.uploader.destroy(review.imageId);
    }

    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
