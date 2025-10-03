import express from "express";
import Review from "../models/Review.js";
import uploader from "../middlewares/cloudinary.config.js"; // 👈 multer-cloudinary
import isAuth from "../middlewares/isAuth.js";

const router = express.Router();

// =================== GET all reviews ===================
router.get("/", async (req, res) => {
  try {
    const { country, city } = req.query;
    let query = {};

    if (country) query.destinationCode = country;
    if (city) query.city = city;

    // 👇 popula tanto o autor da review quanto os autores dos comentários
    const reviews = await Review.find(query)
      .populate("user", "name surname email") // <── aqui popula o autor da review
      .populate("comments.user", "name surname email")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =================== POST new review ===================
router.post(
  "/:destinationCode",
  isAuth,
  uploader.single("image"),
  async (req, res) => {
    try {
      let ratings = {};
      if (req.body.ratings) {
        try {
          ratings = JSON.parse(req.body.ratings);
        } catch (err) {
          console.warn("⚠️ Ratings JSON parse failed:", err.message);
        }
      }

      const newReview = await Review.create({
        user: req.user._id, // agora obrigatório ter auth
        destinationCode: req.params.destinationCode,
        city: req.body.city || "Unknown",
        text: req.body.text,
        imageUrl: req.file ? req.file.path : null,
        ratings,
      });

      await newReview.populate("user", "name surname email");

      res.status(201).json(newReview);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// =================== UPDATE a review ===================
router.put("/:id", isAuth, uploader.single("image"), async (req, res) => {
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
    )
      .populate("user", "name surname email")
      .populate("comments.user", "name surname email");

    if (!updatedReview) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.json(updatedReview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =================== DELETE a review ===================
router.delete("/:id", isAuth, async (req, res) => {
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

// =================== LIKE / UNLIKE review ===================
router.post("/:id/like", isAuth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: "Review not found" });

    const userId = req.user._id.toString();

    const hasLiked = review.likes.some((like) => like.toString() === userId);

    if (hasLiked) {
      review.likes = review.likes.filter((like) => like.toString() !== userId);
    } else {
      review.likes.push(req.user._id);
    }

    // ⚡ salva ignorando validação de campos obrigatórios
    await review.save({ validateBeforeSave: false });

    await review.populate("user", "name email");
    res.json(review);
  } catch (err) {
    console.error("❌ Error in LIKE route:", err.message, err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
