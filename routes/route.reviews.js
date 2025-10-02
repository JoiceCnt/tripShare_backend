import express from "express";
import Review from "../models/Review.js";
import uploader from "../middlewares/cloudinary.config.js"; // 👈 multer-cloudinary

const router = express.Router();

// GET all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new review (with optional image + ratings + city)
router.post("/:destinationCode", uploader.single("image"), async (req, res) => {
  try {
    let ratings = {};
    if (req.body.ratings) {
      try {
        ratings = JSON.parse(req.body.ratings); // 👈 garante que seja objeto
      } catch (err) {
        console.warn("⚠️ Ratings JSON parse failed:", err.message);
      }
    }

    const newReview = await Review.create({
      user: req.user?._id, // se tiver autenticação
      destinationCode: req.params.destinationCode,
      city: req.body.city || "Unknown",
      text: req.body.text,
      imageUrl: req.file ? req.file.path : null,
      ratings,
    });

    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE a review (text + city + optional new image + ratings)
router.put("/:id", uploader.single("image"), async (req, res) => {
  try {
    let ratings = {};
    if (req.body.ratings) {
      try {
        ratings = JSON.parse(req.body.ratings);
      } catch (err) {
        console.warn("⚠️ Ratings JSON parse failed:", err.message);
      }
    }

    const updateData = {
      text: req.body.text,
      city: req.body.city || "Unknown",
      ratings,
    };

    if (req.file) updateData.imageUrl = req.file.path;

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.json(updatedReview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a review
router.delete("/:id", async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);
    if (!deletedReview) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
